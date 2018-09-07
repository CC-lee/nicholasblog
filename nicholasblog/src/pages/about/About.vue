<template src="./About.html"></template>

<script>
import api from 'api'
export default {
  data() {
    return {
      center: null,
      active: '简历信息',
      text: '简历信息',
      english: 'Information of Resume',
      resume: {
        text: '简历信息',
        english: 'Information of Resume',
        contentLeft: {
          intro: {
            title: '个人简介',
            engtitle: 'Introduction',
            content: ''
          }
        },
        contentRight: {
          skills: {
            title: '相关技能',
            engtitle: 'Skills',
            content: ''
          }
        }
      },
      website: {
        text: '个人网站项目介绍',
        english: 'Project of Personal Website',
        contentLeft: {
          intro: {
            title: '项目简介',
            engtitle: 'Introduction',
            content: ''
          },
          feature: {
            title: '特性简介',
            engtitle: 'Feature',
            content: ''
          }
        },
        contentRight: {
          techPoint: {
            title: '技术要点',
            engtitle: 'Keys of Technique',
            content: ''
          },
          optimize: {
            title: '性能优化',
            engtitle: 'Optimization',
            content: ''
          },
          detail: {
            title: '项目详细',
            engtitle: 'Detail',
            content: ''
          }
        }
      },
      plugin: {
        text: 'JS插件项目介绍',
        english: 'Project of Javascript Plugin',
        contentLeft: {
          intro: {
            title: '项目简介',
            engtitle: 'Introduction',
            content: ''
          },
          feature: {
            title: '特性简介',
            engtitle: 'Feature',
            content: ''
          }
        },
        contentRight: {
          techPoint: {
            title: '技术要点',
            engtitle: 'Keys of Technique',
            content: ''
          },
          optimize: {
            title: '性能优化',
            engtitle: 'Optimization',
            content: ''
          },
          detail: {
            title: '项目详细',
            engtitle: 'Detail',
            content: ''
          }
        }
      }
    }
  },
  methods: {
    changeStatus(evt, kind) {
      this.$router.push(`?w=${kind.text}`)
      this.text = kind.text
      this.english = kind.english
      this.active = kind.text
      this.center = kind
    },
    loadData() {
      api.about
        .getAbout({})
        .then(result => {
          var list = result.data.data
          for (var i = 0; i < list.length; i++) {
            switch (list[i].title) {
              case '简历-个人简介':
                this.resume.contentLeft.intro.content = list[i].content
                break
              case '简历-相关技能':
                this.resume.contentRight.skills.content = list[i].content
                break
              case '个人网站项目介绍-项目简介':
                this.website.contentLeft.intro.content = list[i].content
                break
              case '个人网站项目介绍-特性简介':
                this.website.contentLeft.feature.content = list[i].content
                break
              case '个人网站项目介绍-技术要点':
                this.website.contentRight.techPoint.content = list[i].content
                break
              case '个人网站项目介绍-性能优化':
                this.website.contentRight.optimize.content = list[i].content
                break
              case '个人网站项目介绍-项目详细':
                this.website.contentRight.detail.content = list[i].content
                break
              case 'JS插件项目介绍-项目简介':
                this.plugin.contentLeft.intro.content = list[i].content
                break
              case 'JS插件项目介绍-特性简介':
                this.plugin.contentLeft.feature.content = list[i].content
                break
              case 'JS插件项目介绍-技术要点':
                this.plugin.contentRight.techPoint.content = list[i].content
                break
              case 'JS插件项目介绍-性能优化':
                this.plugin.contentRight.optimize.content = list[i].content
                break
              case 'JS插件项目介绍-项目详细':
                this.plugin.contentRight.detail.content = list[i].content
                break
            }
          }
        })
        .catch(err => {
          alert(err.message)
        })
    }
  },
  created() {
    this.loadData()
    switch (this.$route.query.w) {
      case '简历信息':
        this.text = this.resume.text
        this.english = this.resume.english
        this.active = this.resume.text
        this.center = this.resume
        break
      case '个人网站项目介绍':
        this.text = this.website.text
        this.english = this.website.english
        this.active = this.website.text
        this.center = this.website
        break
      case 'JS插件项目介绍':
        this.text = this.plugin.text
        this.english = this.plugin.english
        this.active = this.plugin.text
        this.center = this.plugin
        break
    }
    if (!this.center) {
      this.center = this.resume
    }
  }
}
</script>

<style lang="scss" scoped>
@import './About.scss';
</style>
