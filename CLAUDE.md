@AGENTS.md

# Form rules
- Form nhập liệu dùng `useActionState` (React 19) thay `useState` rời rạc quản field + pending + error.
- Validate input bằng `zod` (`safeParse`) trong action function, không validate thủ công trong component.

# Router + locale rule
- Mọi navigate/link nội bộ (`Link href`, `router.push`, `router.replace`) dùng `Link`/`useRouter` từ `@/features/i18n/navigation` (KHÔNG import trực tiếp từ `next/link`/`next/navigation`). Wrapper tự phát hiện app có đang chạy trong `app/[locale]` hay không (đọc `useParams().locale`) và tự nhúng prefix locale vào path đích — component viết `router.push("/login")`/`<Link href="/login">` như route phẳng bình thường, không tự ghép `/${locale}` thủ công.
- Nhúng locale chỉ áp dụng cho path nội bộ (bắt đầu bằng `/`, không phải `//` — tức không phải URL tuyệt đối/domain khác). Link ra ngoài domain khác giữ nguyên, không bị nhúng locale sai.
- Đổi ngôn ngữ (LanguageSwitcher) vẫn dùng `useRouter()` gốc từ `next/navigation`, tự thay prefix locale trong pathname rồi push — không dùng wrapper `useRouter` cho case này (case này cần đổi locale, không giữ locale hiện tại).
- `useTranslation()` đọc `locale` từ `useParams()` (route segment), không đọc từ Zustand — tránh lệch giá trị lúc mount đầu (nguyên nhân gây chớp ngôn ngữ). Zustand (`useLocaleStore`) chỉ dùng để side-effect ngoài React tree đọc được (`api-client.ts`), sync một chiều từ URL qua `LocaleSync`, không phải nguồn đọc cho UI.

# Dependency version rule
- Mọi dependency phải pin đúng version (không `^`/`~`). `.npmrc` đã có `save-exact=true` nhưng không tự áp dụng cho version đã ghi tay trong `package.json` — sau `pnpm add <pkg>`, luôn mở `package.json` kiểm tra lại dòng vừa thêm không có dấu `^`/`~` trước khi coi là xong việc.
