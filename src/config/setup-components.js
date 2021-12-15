// Core Components
import Toolbar from '../components/core/Toolbar.vue';
import Navigation from '../components/core/NavigationDrawer.vue';
import Breadcrumbs from '../components/core/Breadcrumbs.vue';
import PageFooter from '../components/core/PageFooter.vue';
import Widget from '../components/core/Widget.vue';
import VImageInput from 'vuetify-image-input';
import Avataaars from 'vuejs-avataaars'
import { quillEditor  } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import GoTop from "@inotom/vue-go-top"

function setupComponents(Vue) {

  Vue.component('toolbar', Toolbar);
  Vue.component('breadcrumbs', Breadcrumbs);
  Vue.component('navigation', Navigation);
  Vue.component('page-footer', PageFooter);
  Vue.component('widget', Widget);
  Vue.component('editor', quillEditor );
  Vue.component('avatar', Avataaars );
  Vue.component(VImageInput.name, VImageInput);
  Vue.component('go-top', GoTop);
}


export {
  setupComponents
}
