# Danh sÃ¡ch cÃ´ng viá»c â tÃ¡i táº¡o UFO Tráº¡m Gá»i BÃ i 3D

> Tráº¡ng thÃ¡i chá» ÄÆ°á»£c chuyá»n sang hoÃ n táº¥t khi ÄÃ£ kiá»m tra. Báº£n cÅ© trong repo lÃ  ná»n tham kháº£o ká»¹ thuáº­t, khÃ´ng pháº£i giao diá»n ÄÃ­ch.

## 0. Kháº£o sÃ¡t vÃ  Äá»nh hÆ°á»ng

- [x] XÃ¡c nháº­n URL website gá»c vÃ  kháº£o sÃ¡t giao diá»n/luá»ng chÆ¡i.
- [x] XÃ¡c nháº­n repo hiá»n táº¡i Äang chá»©a project khÃ¡c vá» UI vÃ  cÆ¡ cháº¿ quiz.
- [x] Viáº¿t láº¡i káº¿ hoáº¡ch triá»n khai theo website gá»c.
- [x] Chá»t pháº¡m vi: cáº£nh quÃ©t hÃ i hÆ°á»c, ngÃ¢n hÃ ng áº£nh/text vÃ  ba dáº¡ng bÃ i.

## 1. Dá»¯ liá»u vÃ  luáº­t gá»i bÃ i

- [x] 1.1 Táº¡o model lá»p, há»c sinh, lá»ch sá»­ chuyáº¿n bay vÃ  thiáº¿t láº­p.
- [x] 1.2 ThÃªm ná»n localStorage vá»i dá»¯ liá»u lá»p máº«u.
- [x] 1.3 Ná»i thÃªm/sá»­a/xÃ³a lá»p vÃ  há»c sinh vÃ o giao diá»n má»i.
- [x] 1.4 Ná»i báº­t/táº¯t tá»«ng há»c sinh vÃ  Báº­t táº¥t cáº£ vÃ o giao diá»n má»i.
- [x] 1.5 CÃ i luáº­t chá»n ngáº«u nhiÃªn 1/nhiá»u há»c sinh, cÃ³/khÃ´ng chá»ng trÃ¹ng.
- [x] 1.6 CÃ i reset vÃ²ng vÃ  nháº­t kÃ½ chuyáº¿n bay á» táº§ng domain.
- [x] 1.7 Viáº¿t test cho cÃ¡c luáº­t chá»n ngáº«u nhiÃªn.

## 2. Ná»i dung há»c táº­p

- [x] 2.1 Model bá» ná»i dung, cÃ¢u há»i vÃ  gÃ¡n bá» cho lá»p.
- [~] 2.2 SafeStore: IndexedDB cho kho áº£nh; fallback vÃ  migration cÃ²n cáº§n test trÃªn trÃ¬nh duyá»t cháº·n storage.
- [x] 2.3 NÃ©n PNG/JPG/WebP sang WebP, giá»¯ alpha, chuáº©n hÃ³a ID vÃ  bÃ¡o file khÃ´ng há»£p lá».
- [x] 2.4 Kho áº£nh: kÃ©o-tháº£, thumbnail, dung lÆ°á»£ng/quota vÃ  xÃ³a tá»«ng áº£nh hoáº·c toÃ n bá» cÃ³ xÃ¡c nháº­n.
- [x] 2.5 Backup/Restore v2: lá»p, cÃ¢u há»i, cÃ i Äáº·t, metadata + Base64 áº£nh; validate trÆ°á»c restore vÃ  ghi ImageDB trÆ°á»c.
- [x] 2.6 Quáº£n lÃ½ cÃ¢u há»i text/áº£nh; kiá»m tra dá»¯ liá»u trÆ°á»c khi chÆ¡i.
- [x] 2.7 Flashcards 1â7 tháº», xÃ¡c nháº­n tháº£ xuá»ng khi ÄÃºng háº¿t.
- [x] 2.8 Quiz: 1 ÄÃ¡p Ã¡n ÄÃºng + 3 ÄÃ¡p Ã¡n sai, xÃ¡o lá»±a chá»n.
- [x] 2.9 Äiá»n khuyáº¿t, anagram vÃ  unjumble.
- [x] 2.10 Luá»ng ÄÃºng/tháº£ xuá»ng, sai/thá»­ láº¡i trÃªn UFO.
- [ ] 2.11 Kiá»m thá»­ thá»§ cÃ´ng upload 100+ áº£nh, backup/restore, file sai vÃ  SafeStore.

## 3. Giao diá»n chuáº©n ÄÃ­ch

- [~] 3.1 Header: logo, nháº¡c/SFX riÃªng, cÃ i Äáº·t vÃ  Giáº£m hiá»u á»©ng; hÆ°á»ng dáº«n/toÃ n mÃ n hÃ¬nh cÃ²n thiáº¿u.
- [x] 3.2 Panel chá»n lá»p vÃ  phi hÃ nh ÄoÃ n.
- [x] 3.3 Dark mode navy/cyan/lime cÃ³ hierarchy, focus state vÃ  khÃ´ng dÃ¹ng khá»i hÃ¬nh thÃ´.
- [x] 3.4 SÃ¢n kháº¥u vá»i HUD tráº¡ng thÃ¡i vÃ  ba gÃ³c camera.
- [x] 3.5 Äiá»u khiá»n sá» báº¡n, khÃ´ng gá»i trÃ¹ng, thá»i gian vÃ  báº¯t Äáº§u lÆ°á»£t.
- [~] 3.6 Quáº£n lÃ½ lá»p vÃ  ná»i dung ÄÃ£ cÃ³; nháº­t kÃ½ chuyáº¿n bay/Cháº¿ Äá» giÃ¡o viÃªn cÃ²n thiáº¿u.
- [x] 3.7 Responsive laptop/mÃ n hÃ¬nh háº¹p, bÃ n phÃ­m vÃ  Giáº£m hiá»u á»©ng.

## 4. Cáº£nh 3D vÃ  Ã¢m thanh

- [x] 4.1 Dá»±ng UFO, khu phá», cÃ¢y, bá»¥i, nÆ°á»c, váº­t cáº£n vÃ  nhÃ¢n váº­t tá»± táº¡o.
- [x] 4.2 Ba gÃ³c camera: toÃ n cáº£nh, theo dáº¥u UFO, gÃ³c phá».
- [x] 4.3 QuÃ©t: nháº¡c tÄng nhá»p, UFO blink, tia sÃ¡ng quÃ©t vÃ  má»¥c tiÃªu bÃ­ máº­t.
- [x] 4.4 HÃ nh Äá»ng nÃ© trÃ¡nh: lá»n nhÃ o, ÄÃ o Äáº¥t, nháº£y nÆ°á»c, leo cÃ¢y, chui bá»¥i, nháº£y hÃ ng rÃ o.
- [x] 4.5 Giá»i háº¡n hÃ nh Äá»ng Äá»ng thá»i/cooldown vÃ  giáº£m hiá»u á»©ng Äá» giá»¯ hiá»u nÄng.
- [~] 4.6 Chuá»i quÃ©t â hÃºt â bÃ i há»c â tháº£ xuá»ng/thá»­ láº¡i; nháº­t kÃ½ cÃ²n thiáº¿u.
- [x] 4.7 Ãm thanh Web Audio báº­t/táº¯t ngay ÄÆ°á»£c.

## 5. Kiá»m thá»­ vÃ  phÃ¡t hÃ nh

- [x] 5.1 Cháº¡y 40 test, type-check vÃ  build production.
- [~] 5.2 ÄÃ£ kiá»m tra settings, kho áº£nh trá»ng/ngÃ¢n hÃ ng bÃ i, lÆ°á»£t quÃ©t vÃ  quiz end-to-end trÃªn Pages; cÃ²n test flashcard, Äiá»n tá»«/anagram/unjumble vá»i dá»¯ liá»u tháº­t vÃ  áº£nh lá»i.
- [~] 5.3 ÄÃ£ kiá»m tra reload, khÃ´ng trÃ¹ng cÆ¡ báº£n vÃ  Giáº£m hiá»u á»©ng; cÃ²n test lá»p/há»c sinh, Ã¢m thanh vÃ  reset Äáº§y Äá»§ trÃªn mÃ¡y cÃ³ WebGL.
- [x] 5.4 Cáº­p nháº­t README vÃ  GitHub Pages.
- [x] 5.5 XÃ¡c nháº­n link phÃ¡t hÃ nh.
