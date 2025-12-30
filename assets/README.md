# Assets Klasörü

Bu klasör uygulama ikonları ve splash screen görüntülerini içermelidir.

## Gerekli Dosyalar

1. **icon.png** - Uygulama ikonu (1024x1024 px önerilir)
2. **splash-icon.png** - Splash screen ikonu
3. **adaptive-icon.png** - Android adaptive icon
4. **favicon.png** - Web favicon

## Hızlı Başlangıç

Aşağıdaki komutla varsayılan Expo asset'lerini oluşturabilirsiniz:

```bash
npx create-expo-app@latest temp-app --template blank
cp temp-app/assets/* ./assets/
rm -rf temp-app
```

Veya Expo'nun online asset generator'ını kullanabilirsiniz:
https://docs.expo.dev/develop/user-interface/splash-screen/

## Önerilen Tasarım

- **icon.png**: Koyu mavi arkaplan (#0a0a1a) üzerinde altın rengi bir galaksi/gezegen görseli
- **splash-icon.png**: Aynı tema, merkezde küçük bir versiyon

