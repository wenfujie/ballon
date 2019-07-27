import Vue from 'vue'
import {
    Pagination,
    Dialog,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Button,
    Loading,
    MessageBox,
    Form,
    FormItem,
    DatePicker,
    Breadcrumb,
    TimePicker,
    Select,
    Switch,
    Table,
    Option,
    Tabs,
    Message,
    TabPane
} from 'element-ui'

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Loading.directive);
Vue.use(DatePicker);
Vue.use(Breadcrumb);
Vue.use(TimePicker);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Option);
Vue.use(Table);
Vue.use(Tabs);
Vue.use(TabPane);
// Vue.use(Message);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$toast = function(text) {
    Message.closeAll()
    Message(text)
};
