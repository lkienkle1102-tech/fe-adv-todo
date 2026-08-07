@AGENTS.md

# Form rules
- Form nhập liệu dùng `useActionState` (React 19) thay `useState` rời rạc quản field + pending + error.
- Validate input bằng `zod` (`safeParse`) trong action function, không validate thủ công trong component.

# Dependency version rule
- Mọi dependency phải pin đúng version (không `^`/`~`). `.npmrc` đã có `save-exact=true` nhưng không tự áp dụng cho version đã ghi tay trong `package.json` — sau `pnpm add <pkg>`, luôn mở `package.json` kiểm tra lại dòng vừa thêm không có dấu `^`/`~` trước khi coi là xong việc.
