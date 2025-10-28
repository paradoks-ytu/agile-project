# paradoks

## Kurulum

### Backend

Backend'ı kurmak için `backend` dizinininde IntelliJ IDEA ile `AgileProjectApplication` class'ı üzerinden direkt sistemi başlatabilirsiniz
veya aynı dizin üzerinden `mvn clean compile` ile projeyi build edebilirsiniz.

### Frontend

Frontend'i kurmak için `frontend` klasörüne girdikten sonra `npm i` ve `npm run dev` komutlarını çalıştırarak sistemi başlatabilirsiniz.

### Database

Database için postgresql kullanılmaktadır, örnek olarak docker üzerinden database'nin başlatılması aşağıdaki gibidir.

NOT: Burada kullanılan değişkenler backend için ortam değişkeni niteliğindedir, lütfen `backend/.env` dosyası ile bu değişkenlerin
uyuştuğuna dikkat edin.

```bash
docker run --name agile-postgres \
            -e POSTGRES_USER=agile \
            -e POSTGRES_PASSWORD='agile123!' \
            -e POSTGRES_DB=agiledb \
            -p 5432:5432 \
            -d postgres:15
```

## Enviorement

Uygulamamızda backend ve fronend için iki farklı değişken ortamına ihtiyacımız vardır.

Bu değişken dosyaları iki projenin de kök dizininde bulunacak `.env` dosyalarıdır.

### Frontend

Backend serverimizin URL'sini girmemiz yeterli olacaktır.

#### Örnek

```.env
VITE_API_URL=http://127.0.0.1:8080
```

### Backend

Frontend uygulamızın URL'sini ve database bilgilerini girmemiz gerekmektedir.

`.env` dosyasına eklenen ortam değişkenleri aynı zamanda `AgileProjectApplication` class'ı üzerinden
sisteme eklenmelidir.

#### Örnek

```.env
FRONTEND_URL=http://127.0.0.1:5173
DB_HOST=localhost:5432
DB_DATABASE=agiledb
DB_USERNAME=agile
DB_PASSWORD=agile123!
```