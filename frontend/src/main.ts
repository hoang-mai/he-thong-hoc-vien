import { createApp } from "vue";
import Antd from "ant-design-vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers/index";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import * as Icons from "@ant-design/icons-vue";
import { createPinia } from "pinia";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const app = createApp(App);

Object.keys(Icons).forEach((key) => {
  app.component(key, (Icons as any)[key]);
});
app.use(router);
app.use(createPinia());
app.use(Antd);

app.use(Vue3Toastify, {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
  draggable: true,
  progress: undefined,
} as ToastContainerOptions);

app.mount("#app");
