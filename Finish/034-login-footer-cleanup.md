# Login 底部兩行移除

- 對應 Plans/034-login-footer-cleanup.md。
- 已移除登入頁 Continue as Guest 及 By continuing…Terms & Privacy Policy。保留 Don't have an account? Create Account。
- 瀏覽器確認 auth-guest、auth-legal 均不存在，帳號切換文字保留。
- 更新既有測試確認登入頁不含兩個入口，註冊條款仍可正常開啟。
- npm test：57/57通過；npm run build通過。
