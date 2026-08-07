import type en from "./en"

const vi: typeof en = {
  common: {
    login: "Đăng nhập",
    register: "Đăng ký",
    email: "Email",
    password: "Mật khẩu",
  },
  home: {
    badge: "Quản lý công việc thông minh",
    title: "Advanced",
    titleHighlight: "Todo",
    subtitle: "Quản lý công việc của bạn ở một nơi. Đăng nhập hoặc tạo tài khoản để bắt đầu.",
    features: {
      organize: {
        title: "Quản lý gọn gàng",
        description: "Sắp xếp công việc theo dự án, gắn nhãn ưu tiên, không bỏ lỡ deadline.",
      },
      track: {
        title: "Theo dõi tiến độ",
        description: "Đánh dấu hoàn thành, xem thống kê để biết mình đang làm tốt tới đâu.",
      },
      smooth: {
        title: "Trải nghiệm mượt",
        description: "Giao diện nhanh, đồng bộ realtime, dùng tốt trên cả điện thoại và máy tính.",
      },
    },
  },
  auth: {
    login: {
      title: "Đăng nhập",
      description: "Nhập email và mật khẩu để tiếp tục.",
      submit: "Đăng nhập",
      submitting: "Đang đăng nhập...",
      noAccount: "Chưa có tài khoản?",
      registerLink: "Đăng ký",
    },
    register: {
      title: "Đăng ký",
      description: "Tạo tài khoản mới để bắt đầu.",
      submit: "Đăng ký",
      submitting: "Đang đăng ký...",
      hasAccount: "Đã có tài khoản?",
      loginLink: "Đăng nhập",
    },
    error: {
      generic: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    },
  },
}

export default vi
