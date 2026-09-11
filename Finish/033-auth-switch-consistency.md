# 帳號切換區統一

- 對應 Plans/033-auth-switch-consistency.md。
- 登入頁改為社群入口下方的 Don't have an account? Create Account，與註冊頁 Already have an account? Log In 共用 auth-switch。
- 移除原先 Log In 下方獨立連結及其CSS。訪客、條款及註冊送出按鈕保留。
- 瀏覽器兩頁核對：前一元素均為 auth-socials、11px、置中。Create Account 點擊成功到註冊頁。
- npm test：57/57通過；npm run build通過。
