<template>
  <div class="Index">
    <div class="height">
      <input
        type="text"
        class="a_title"
        placeholder="请输入标题..."
        v-model="formData.title"
      />
      <div class="action pr-2">
        <div class="mr-2">
          <v-menu
            offset-y
            :close-on-content-click="false"
            :nudge-bottom="10"
            left
          >
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-icon size="20">{{
                  $icons['mdi-image-size-select-actual']
                }}</v-icon>
              </v-btn>
            </template>
            <v-card
              :width="260"
              :min-height="140"
              class="d-flex align-center justify-center pa-3"
            >
              <v-btn
                text
                v-if="!formData.coverUrl"
                x-large
                @click="handleUpload"
                :loading="fileUploading"
              >
                <v-icon x-large>{{
                  $icons['mdi-cloud-upload-outline']
                }}</v-icon>
                <input
                  type="file"
                  hidden
                  ref="upload"
                  accept="image/*"
                  @change="onUpload"
                />
              </v-btn>
              <div v-else>
                <v-img :src="formData.coverUrl" :width="240">
                  <div class="d-flex flex-end justify-end">
                    <v-btn :elevation="0" small dark @click="handleDelImage">
                      <v-icon small>{{ $icons['mdi-trash-can'] }}</v-icon>
                    </v-btn>
                  </div>
                </v-img>
              </div>
            </v-card>
          </v-menu>
        </div>

        <div class="pr-3">
          <v-menu offset-y :close-on-content-click="false" :nudge-bottom="10">
            <template v-slot:activator="{ on }">
              <v-btn color="error" text :elevation="0" v-on="on">发布</v-btn>
            </template>
            <v-card width="240px">
              <v-card-text>标签</v-card-text>
              <div class="pa-2">
                <v-chip
                  class="ma-2"
                  small
                  label
                  :outlined="!item.selectd"
                  v-for="item in taglistSelect"
                  :key="item.id"
                  @click="handleSelectItem(item)"
                  color="primary"
                >
                  <v-icon x-small left>{{
                    $icons['mdi-' + item.icon]
                  }}</v-icon>
                  {{ item.name }}
                </v-chip>
              </div>
              <v-card-actions>
                <div class="pa-2">
                  <v-btn
                    color="error"
                    small
                    tile
                    outlined
                    @click="handlePublish"
                    :loading="loading"
                    >发布</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
        <div>
          <current-user />
        </div>
      </div>
    </div>
    <div class="edit_box">
      <client-only>
        <mavon-editor
          v-model="formData.content"
          :boxShadow="false"
          editorBackground="inherit"
          previewBackground="inherit"
          :toolbarsFlag="false"
          :tabSize="2"
          ref="mdeditor"
          @imgAdd="handleEditAddImg"
          :codeStyle="$vuetify.theme.dark ? 'atom-one-light' : 'atom-one-light'"
        />
        <Loading :absolute="true" :hidden="!uploading" />
      </client-only>
    </div>
    <client-only>
      <BindPhone
        v-if="user && !user.phone"
        :visible.sync="bindPhoneModal"
        @success="handleBindPhoneSuccess"
      />
    </client-only>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CurrentUser from '@/components/CurrentUser.vue';
import { fileSize as $file_fileSize } from '@/utils/file'
import { asyncLoad } from '@/utils/loadScriptComponent';
import Loading from '@/components/common/Loading.vue';

export default {
  layout: 'empty',
  components: {
    CurrentUser,
    Loading,
    BindPhone: () => import('@/components/user/BindPhone.vue'),
    'mavon-editor': asyncLoad.mavonEditorComponent
  },
  async asyncData ({ params, query, $axios }) {
    if (params.type == 'new') {
      return {};
    }
    const id = query.id;
    const data = await $axios.get(`/api/article/${id}/basis`);

    return {
      isUpdate: true,
      formData: {
        id: data.id,
        title: data.title,
        coverUrl: data.coverUrl,
        content: data.content,
        tags: data.tags && data.tags.map(item => item.tagId) || []
      },
    };
  },
  computed: {
    ...mapState(['user']),
    taglistSelect () {
      return this.taglist.map(item => {
        const isSelectd = (this.formData.tags || []).find(
          tag => item.id == tag
        );
        return {
          ...item,
          selectd: !!isSelectd
        };
      });
    }
  },
  data () {
    return {
      isUpdate: false,
      taglist: [],
      loading: false,
      fileUploading: false,
      uploading: false,
      bindPhoneModal: false,
      formData: {
        title: '',
        coverUrl: '',
        // htmlContent: '',
        content: '',
        tags: []
      }
    };
  },
  watch: {
    formData: {
      deep: true,
      handler (v) {
        if (process.client && this.$route.params.type === 'new') {
          localStorage.setItem('cache_edit', JSON.stringify(v));
        }
      }
    }
  },
  async mounted () {
    const resData = await this.$axios.get('/api/tag/list');
    this.taglist = resData;
    if (process.client && this.$route.params.type === 'new') {
      const strData = localStorage.getItem('cache_edit')
      try {
        if (strData) {
          const d = JSON.parse(strData)
          this.formData = d;
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  methods: {
    handleSelectItem (item) {
      const tag = this.taglist.find(tag => tag.id == item.id);
      const tagIndex = this.formData.tags.findIndex(tagId => tagId == tag.id);
      this.$set(tag, 'selectd', !item.selectd);
      if (tagIndex >= 0) {
        this.formData.tags.splice(tagIndex, 1);
      } else {
        this.formData.tags.push(tag.id);
      }
    },
    renderHtml (content = '') {
      const md = this.$refs['mdeditor'].markdownIt;
      const resRender = md.render(content);
      return resRender;
    },
    getSummary (content = '') {
      const resRender = this.renderHtml(content);
      const divEl = document.createElement('div');
      divEl.innerHTML = resRender;
      const p = divEl.querySelector('p');
      const text = p ? p.innerText : '';
      return text.substring(0, 180);
    },
    async handlePublish () {
      if (!this.user.phone) {
        return this.handleBindPhone();
      }
      const formData = this.formData;
      formData.tags = this.taglistSelect.filter(item => item.selectd).map(item => item.id);
      // formData.summary = this.getSummary(formData.content);
      // formData.htmlContent = this.renderHtml(formData.content);
      // tags
      if (formData.title.length < 1 || formData.title.length > 100) {
        return this.$snackbar.error('标题不能为空,且不能超过100个字符');
      }
      if (formData.content.length < 50) {
        return this.$snackbar.error('内容不能少于50个字符');
      }
      this.loading = true;
      let resData;

      if (this.isUpdate) {
        console.log('formData', formData);

        resData = await this.$axios.put(
          `/api/article/${formData.id}`,
          formData
        );
      } else {
        resData = await this.$axios.post('/api/article', formData);
      }
      localStorage.removeItem('cache_edit');
      // formData
      // TODO: 跳转成功页面
      this.$router.push('/article/' + (resData.id || formData.id));
      this.loading = false;
      this.formData = {
        // htmlContent: '',
        coverUrl: '',
        content: '',
        tags: [],
        title: ''
      };
    },
    handleUpload () {
      this.$refs['upload'].click();
    },
    async handleuploadImg (file) {

      const size = $file_fileSize(file);
      if (size > 3) {
        return this.$snackbar.error('文件大小不能超过3m');
      }
      this.fileUploading = true;
      const fd = new FormData();
      fd.append('file', file);
      try {
        const url = await this.$axios.post('/api/common/uploadImage', fd);
        // url
        this.formData.coverUrl = 'https:' + url;
      } catch (error) {
        console.error(error);
      }
      this.fileUploading = false;
    },
    onUpload (e) {
      // console.log();
      const files = e.target.files;
      [...files].forEach(file => {
        this.handleuploadImg(file);
      });
    },
    handleDelImage () {
      this.formData.coverUrl = '';
    },
    async handleEditAddImg (pos, $file) {
      this.uploading = true;
      const formdata = new FormData();
      formdata.append('file', $file);
      const fileurl = await this.$axios.post('/api/common/uploadImage', formdata);
      this.$refs['mdeditor'].$img2Url(pos, fileurl);
      this.uploading = false;
    },
    handleBindPhone () {
      this.bindPhoneModal = true;
    },
    handleBindPhoneSuccess () {
      this.$nextTick(() => {
        this.handlePublish();
      });
    }
  }
};
</script>
<style lang="scss">
.Index {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  .height {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-sizing: border-box;
    color: #000;
    font-weight: bold;
    padding: 0 12px;
    background-color: #fff;
    .a_title {
      height: 100%;
      flex: 1;
      padding: 12px;
      font-size: 28px;
      outline: none;
    }
    .action {
      display: flex;
      align-items: center;
    }
  }
  .edit_box {
    flex: 1;
    overflow: hidden;
    position: relative;
    .v-note-wrapper.markdown-body {
      height: 100%;
    }
  }
}
</style>