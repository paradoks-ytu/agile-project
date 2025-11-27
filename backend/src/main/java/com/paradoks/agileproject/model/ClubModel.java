package com.paradoks.agileproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "clubs")
@Getter
@Setter
public class ClubModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "club_tags", joinColumns = @JoinColumn(name = "club_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePicture;
}
