

# Hyva_CompatBase 

Repo này bao gồm cả 2 thư mục module và theme.
Module `HyvaCompatBase` chứa các alpine js plugins và helper functions load url các file javascript sau khi đã bundling.


## Alpine plugins

Có sẵn 3 layout file để sử dụng các plugin này. Bao gồm:

| Plugin Name | Description |
|-------------| ----------- |
| `alpinejs_plugins_fragment.xml` | Sử dụng với `x-if` cho phép in ra các thành phần cùng cấp mà không phải gom vào một thẻ khác
| `alpinejs_plugins_mageUrl.xml`  | Sử dụng `$mageUrl` để tạo url. Tương tự như `mage/url`
| `alpinejs_plugins_component.xml`| Dùng để viết các alpine component. Plugin vẫn đang trong giai đoạn phát triển


## BundleFileResolver

Sử dụng hàm `getBundleFileUrl` để lấy url của file javascript sau khi bundled và minified.

`$pattern` phải có cấu trúc: `Vendor_Module::path/to/file.js`

Và file javascript cần lấy này phải thuộc danh sách entry points ( Sẽ được đề cập tới ).


## Rollup

Project sẽ sử dụng Rollup để thực hiện bundling và minify.

Toàn bộ bundling tool sẽ nằm trong thư mục custom Hyva Theme. Ở repo này đang để là `Bss/Hyva`.

Chạy npm ở `design/frontend/Bss/Hyva/web/rollup/`.

Khi dev:
```console
$ npm run build:dev
```

Khi build production:
```console
$ npm run build:prod
```

### Entry points

Các entry point là các file javascript mà Rollup cần để thực hiện phân chia code thành các file dùng chung - được gọi là **chunks**

Bằng cách này, source code sẽ được tối ưu về kích cỡ do những function mà các file này dùng chung được tách nhỏ thành các chunks có thể tái sử dụng.

`BundleFileResolver::getBundleFileUrl` chỉ có thể trả URL của các file js được chọn làm entry point. Những file khác sẽ không thể tạo ra URL đúng được.

Khai báo các entry point ở file `rollup.config.js`

### rollup.config.js

Để Rollup có thể thực hiện bundling, tạo file `rollup.config.js` ở Custom Module hoặc ở Custom Theme. Cách làm giống như `requirejs.config.js`.

Các file javascript sẽ phải đặt trong thư mục `web`

```
code/
├─ Vendor/
│  ├─ Module/
│  │  ├─ view/
│  │  │  ├─ frontend/
│  │  │  │  ├─ web/
│  │  │  │  │  ├─ main.js
│  │  │  │  ├─ rollup.config.js
design/
├─ frontend/
│  ├─ Bss/
│  │  ├─ Hyva/
│  │  │  ├─ Bss_CustomModule/
│  │  │  │  ├─ web/
│  │  │  │  │  ├─ main2.js
│  │  │  │  ├─ rollup.config.js

```

Nội dung file như sau:
```javascript
const config = {
    entries: ['main.js']
};
module.exports = config;
```

`entries` là danh sách entry points nằm trong thư mục `web` của config hiện tại.

Để import các javascript file từ các module khác. Có thể sử dụng alias như sau:

```javascript
import config from "Vendor_Module::path/to/file.js"

console.log(config)
```

Sau khi build xong, toàn bộ các bundle file sẽ nằm ở thư mục `design/frontend/Bss/Hyva/web/rollup/build`.