package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.exception.BadRequestException;
import com.paradoks.agileproject.exception.FileUploadException;
import com.paradoks.agileproject.exception.NotFoundException;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.Post;
import com.paradoks.agileproject.model.ClubSession;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.PostRepository;
import com.paradoks.agileproject.utils.PasswordUtils;
import org.imgscalr.Scalr;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.paradoks.agileproject.dto.request.PageableRequestParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final PasswordUtils passwordUtils;
    private final ClubSessionService clubSessionService;

    private final static List<String> ALLOWED_EXTENSIONS = List.of("png", "jpg");
    private final PostRepository postRepository;

    @Value("${upload-dir}")
    private String uploadDir;

    public ClubServiceImpl(ClubRepository clubRepository, PasswordUtils passwordUtils, ClubSessionService clubSessionService, PostRepository postRepository) {
        this.clubRepository = clubRepository;
        this.passwordUtils = passwordUtils;
        this.clubSessionService = clubSessionService;
        this.postRepository = postRepository;
    }

    @Override
    public ClubModel getClub(Long clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new NotFoundException("Club not found"));
    }

    @Override
    public ClubModel updateClub(Long clubId, ClubUpdateRequest request) {
        ClubModel club = getClub(clubId);
        if (request.getName() != null) {
            club.setName(request.getName());
        }
        if (request.getDescription() != null) {
            club.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            club.setTags(request.getTags());
        }
        return clubRepository.save(club);
    }

    @Override
    public ClubModel updateClubDescription(Long clubId, com.paradoks.agileproject.dto.request.ClubDescriptionUpdateRequest request) {
        ClubModel club = getClub(clubId);
        club.setDescription(request.getDescription());
        return clubRepository.save(club);
    }

    @Override
    public Page<Post> listClubPosts(Long clubId, PageableRequestParams params) {
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), Sort.by(params.getSortBy()));
        return postRepository.findAllByClub_Id(clubId, pageable);
    }

    @Override
    public Page<ClubModel> listClubs(PageableRequestParams params) {
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), Sort.by(params.getSortBy()));
        return clubRepository.findAll(pageable);
    }

    @Override
    public ApiResponse register(RegisterRequest request) {
        if (clubRepository.existsByName(request.getClubName())) {
            throw new BadRequestException("Club with this name already exists");
        }

        if (clubRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Club with this email already exists");
        }

        ClubModel club = new ClubModel();
        club.setName(request.getClubName());
        club.setEmail(request.getEmail());
        club.setPassword(passwordUtils.hashPassword(request.getPassword()));
        clubRepository.save(club);

        return new ApiResponse(true, "Kayıt başarılı!");
    }

    @Override
    public String login(LoginRequest request) {
        Optional<ClubModel> clubOpt = clubRepository.findByEmail(request.getEmail());

        if (clubOpt.isEmpty()) {
            throw new NotFoundException("Invalid credentials");
        }

        ClubModel club = clubOpt.get();

        if (!passwordUtils.checkPassword(request.getPassword(), club.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        ClubSession session = clubSessionService.createSession(club, 24); // 24 saat geçerli

        return session.getToken();
    }

    @Override
    public ClubModel updateProfilePicture(Long clubId, MultipartFile profilePicture) {
        if (profilePicture.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }

        if (profilePicture.getContentType() == null || !profilePicture.getContentType().startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        if (profilePicture.getSize() > 2 * 1024 * 1024) {
            throw new BadRequestException("File size must be less than 2MB");
        }

        ClubModel club = getClub(clubId);

        // Delete old profile picture if it exists
        if (club.getProfilePicture() != null) {
            try {
                String oldFileName = club.getProfilePicture();
                File file = new File(oldFileName);
                String fileName = file.getName();
                Path oldFilePath = Paths.get(uploadDir, fileName);
                Files.deleteIfExists(oldFilePath);
            } catch (IOException e) {
                // Log the exception, but don't block the upload
                System.err.println("Failed to delete old profile picture: " + e.getMessage());
            }
        }


        try {
            String imageFormat = getImageFormat(profilePicture);
            if (imageFormat == null || !ALLOWED_EXTENSIONS.contains(imageFormat)) {
                throw new FileUploadException("file format not allowed, use one of these: [\"png\", \"jpg\"]");
            }

            BufferedImage originalImage = ImageIO.read(profilePicture.getInputStream());

            // Crop to a square from the center of the image
            int size = Math.min(originalImage.getWidth(), originalImage.getHeight());
            int x = (originalImage.getWidth() - size) / 2;
            int y = (originalImage.getHeight() - size) / 2;
            BufferedImage croppedImage = Scalr.crop(originalImage, x, y, size, size);

            // Resize to 200x200
            BufferedImage resizedImage = Scalr.resize(croppedImage, 200);

            String fileUrl = copyFileToDisk(resizedImage, imageFormat);

            club.setProfilePicture(fileUrl);
            return clubRepository.save(club);
        } catch (IOException e) {
            throw new FileUploadException("Failed to process image", e);
        }
    }

    @Override
    public ClubModel updateBanner(Long clubId, MultipartFile banner) {
        if (banner.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }

        if (banner.getContentType() == null || !banner.getContentType().startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        if (banner.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must be less than 5MB");
        }

        ClubModel club = getClub(clubId);

        // Delete old banner if it exists
        if (club.getBanner() != null) {
            try {
                String oldFileName = club.getBanner();
                File file = new File(oldFileName);
                String fileName = file.getName();
                Path oldFilePath = Paths.get(uploadDir, fileName);
                Files.deleteIfExists(oldFilePath);
            } catch (IOException e) {
                // Log the exception, but don't block the upload
                System.err.println("Failed to delete old banner: " + e.getMessage());
            }
        }


        try {
            String imageFormat = getImageFormat(banner);
            if (imageFormat == null ||  !ALLOWED_EXTENSIONS.contains(imageFormat)) {
                throw new FileUploadException("file format not allowed, use one of these: [\"png\", \"jpg\"]");
            }

            BufferedImage originalImage = ImageIO.read(banner.getInputStream());

            // Resize to 1200x400
            BufferedImage resizedImage = Scalr.resize(originalImage, 1200, 400);

            String fileUrl = copyFileToDisk(resizedImage, imageFormat);

            club.setBanner(fileUrl);
            return clubRepository.save(club);
        } catch (IOException e) {
            throw new FileUploadException("Failed to process image", e);
        }
    }

    public String getImageFormat(MultipartFile file) throws IOException {
        try (ImageInputStream iis =
                     ImageIO.createImageInputStream(file.getInputStream())) {

            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);

            if (!readers.hasNext()) {
                return null;
            }

            ImageReader reader = readers.next();
            return reader.getFormatName().toLowerCase();
        }
    }


    @NotNull
    private String copyFileToDisk(BufferedImage resizedImage, String format) {
        String fileName = UUID.randomUUID() + "." + format;
        Path uploadPath = Paths.get(uploadDir);

        try {

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            File file = new File(uploadDir, fileName);

            if (!ImageIO.write(resizedImage, format, file)) {
                throw new FileUploadException("Failed to write image");
            }

        } catch (IOException e) {
            System.err.println(e);
            throw new BadRequestException("Failed to create image");
        }

        return "/" + uploadPath + "/" + fileName;
    }

}
