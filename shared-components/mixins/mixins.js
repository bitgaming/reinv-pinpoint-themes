import gql from 'graphql-tag'
import moment from 'moment'
import { format } from 'quasar'
import { getName, overwrite } from 'country-list'
import ISO639_1 from './ISO639_1.json'
import ISO639_2 from './ISO639_2.json'
// import ISO3166_1 from './ISO3166_1.json'
import localeCodes from './localeCodes.json'
import get from 'lodash/get'

overwrite([
  { code: 'TW', name: 'Taiwan' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'RU', name: 'Russia' }
])

export const copy = {
  methods: {
    copy (str) {
      navigator.clipboard.writeText(str)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Copied to clipboard!',
            timeout: 200
          })
        })
    }
  }
}

export const vipStatusTheme = {
  data () {
    return {
      vipStatusIcons: {
        diamond: 'las la-gem',
        gold: 'las la-chess-king',
        silver: 'las la-chess-knight',
        green: 'las la-leaf',
        none: 'las la-minus'
      },
      vipStatusColors: {
        diamond: 'light-blue-8',
        gold: 'yellow-8',
        silver: 'black',
        green: 'green-8'
      },
      vipStatusColorsDark: {
        diamond: 'light-blue-2',
        gold: 'yellow-13',
        silver: 'white',
        green: 'green-13'
      },
      vipStatusTextColors: {
        diamond: 'text-light-blue-8',
        gold: 'text-yellow-8',
        silver: 'text-black',
        green: 'text-green-8'
      },
      vipStatusTextColorsDark: {
        diamond: 'text-light-blue-2',
        gold: 'text-yellow-13',
        silver: 'text-white',
        green: 'text-green-13'
      }
    }
  }
}

export const thumbStyle = {
  data () {
    return {
      thumbStyleHor: {
        right: '0px',
        borderRadius: '2.5px',
        width: '5px',
        opacity: 0.15
      }
    }
  }
}

export const formatNumber = {
  methods: {
    formatNumber (num, dp = 2) {
      // const str = num.toString()
      try {
        const str = Number(num).toFixed(dp)
        const [pt1, pt2] = str.split('.')
        return `${pt1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${pt2 ? `.${pt2}` : ''}`
      } catch {
        return num
      }
    },
    kFormatter (num, dp = 0) {
      const units = [
        [1000000000000, 'T'],
        [1000000000, 'B'],
        [1000000, 'M'],
        [1000, 'K']
      ]

      for (const unit of units) {
        if (Math.abs(num) > unit[0] - 1) {
          return Math.sign(num) * ((Math.abs(num) / unit[0]).toFixed(dp)) + unit[1]
        }
      }

      return Math.sign(num) * Math.abs(num)
    }
  }
}

export const formatString = {
  methods: {
    emailToName (str) {
      if (!str) return str
      const s = str + ''
      const a = s.includes('@') ? s.slice(0, s.indexOf('@')) : s
      return a.replace(/\.|\+/g, ' ').split(' ').reduce((acc, cur) => `${acc} ${format.capitalize(cur)}`, '')
    }
  }
}

let errors = []
export const notifyError = {
  methods: {
    notifyError (error) {
      if (process.env.ENV !== 'prod') console.error(error)
      const { message, networkError } = error

      if ((
        message && [
          'accessToken is required'
        ].some(s => message.includes(s))
      ) || (
        networkError && networkError.statusCode === 403
      )) {
        this.$store.dispatch('auth/reset', true, message)
      }

      const errNotify = this.$q.notify({
        type: 'negative',
        message: message ? message.replaceAll('GraphQL error: ', '') : message,
        timeout: 0,
        actions: [{ icon: 'close', color: 'white' }]
      })
      errors.push(errNotify)
    },
    clearAllErrors () {
      errors.forEach(e => e())
      errors = []
    }
  }
}

const durations = [
  { type: 'years', duration: 1000 * 60 * 60 * 24 * 365 },
  { type: 'months', duration: 1000 * 60 * 60 * 24 * 30 },
  { type: 'days', duration: 1000 * 60 * 60 * 24 },
  { type: 'hours', duration: 1000 * 60 * 60 },
  { type: 'minutes', duration: 1000 * 60, unitAbbr: 'min' },
  { type: 'seconds', duration: 1000, unitAbbr: 'sec' }
  // { type: 'miliseconds', duration: 1, unitAbbr: 'ms' }
]

export const defaultCalendarOptions = {
  sameElse: 'D MMM YYYY, HH:mm:ss'
}

export const vMoment = {
  date () {
    return {
      defaultCalendarOptions
    }
  },
  methods: {
    dateStrFormat (str, format = process.env.DATETIME_FORMAT) {
      try {
        const m = moment((new Date(str)).valueOf())
        return m.format(format)
      } catch (err) {
        console.error(err)
        return str
      }
    },
    dateStrDiffNowUTC (str) {
      try {
        return this.unixDiffNowUTC((new Date(str)).valueOf())
      } catch (err) {
        console.log(err)
        return str
      }
    },
    unixToCalendarUTC (ts) {
      return (('' + ts).length > 10 ? moment(Number(ts)) : moment.unix(Number(ts))).utc().calendar(defaultCalendarOptions)
    },
    unixToCalendar (ts) {
      return (('' + ts).length > 10 ? moment(Number(ts)) : moment.unix(Number(ts))).calendar(defaultCalendarOptions)
    },
    unixDiffNowUTC (ts) {
      const x = ('' + ts).length > 10 ? moment(Number(ts)) : moment.unix(Number(ts))
      const diffMs = moment().diff(x)
      let typeIndex = durations.length - 1

      for (let i = 0; i < durations.length; i++) {
        if (diffMs >= durations[i].duration) {
          typeIndex = i
          break
        }
      }

      let diff = moment().diff(x, durations[typeIndex].type)
      if (!diff) {
        // if the diff is suppose to be smaller than 1s, still round it up to 1s
        if (typeIndex === durations.length - 1) {
          diff = 1
        } else {
          diff = moment().diff(x, durations[++typeIndex].type)
        }
      }

      const typeStr = durations[typeIndex].type
      const unit = durations[typeIndex].unitAbbr || (diff > 1 ? typeStr : typeStr.slice(0, typeStr.length - 1))

      return `${diff} ${unit} ago`
    },
    dateStrToCalendar (val, options = defaultCalendarOptions) {
      return moment(val).calendar(options)
    }
  }
}

export const errorToJson = {
  methods: {
    errorToJson (error) {
      return JSON.parse(JSON.stringify(error))
    }
  }
}

export const localeCodeToEng = {
  data () {
    return {
      localeOptionsFilterText: ''
    }
  },
  computed: {
    localeCodes () {
      return Array.from(new Set([
        ...Object.keys(ISO639_1),
        // ...Object.keys(ISO639_2),
        ...localeCodes
      ]))
    },
    localeOptions () {
      const options = this.localeCodes.map(l => ({
        label: this.localeCodeToEnglish(l),
        value: l
      }))

      options.sort((a, b) => a.label.localeCompare(b.label))

      return options
    },
    localeOptionsFiltered () {
      return this.localeOptionsFilterText ? this.localeOptions.filter(option => {
        return option.label.toLowerCase().includes(this.localeOptionsFilterText.toLowerCase())
      }) : this.localeOptions
    }
  },
  methods: {
    filterFn (val, update) {
      update(() => {
        this.localeOptionsFilterText = val
      })
    },
    localeCodeToEnglish (loc, hideCode = false) {
      if (typeof loc !== 'string') return loc + ''
      const parts = loc.toLowerCase().split('-')

      let str = ''
      if (parts.length > 2) str = loc + ''
      else if (parts.length > 1) str = (ISO639_1[parts[0]] || ISO639_2[parts[0]] || parts[0]) + ' - ' + (getName(parts[1]) || parts[1])
      // else if (parts.length > 1) str = (ISO639_1[parts[0]] || ISO639_2[parts[0]] || parts[0]) + ` (${loc})`
      else if (parts.length > 0) str = (ISO639_1[parts[0]] || ISO639_2[parts[0]] || getName(parts[0]) || parts[0])
      return str + (hideCode ? '' : ` (${loc})`)
    }
  }
}

export const util = {
  data () {
    return {
      gaExpressionMap: {
        banner: x => `ga:pagePathLevel2==/${x}/`,
        affiliateId: x => `ga:pagePathLevel1==/${x}/`,
        country: x => `ga:countryIsoCode==${x.toUpperCase()}`,
        device: x => `ga:deviceCategory==${x.toLowerCase()}`
      }
    }
  },
  methods: {
    downloadFromUrl (url, fileName) {
      const a = document.createElement('a')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.href = url
      a.setAttribute('download', fileName)

      a.click()

      window.URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    },
    getLazyLoadIFrame (str) {
      try {
        const regex = /loading=['"].*?['"]/g
        let temp = str
        if (temp.search(regex) > -1) {
          temp = temp.replace(regex, 'loading="lazy"')
        } else {
          const part1 = temp.slice(0, 7)
          const part2 = temp.slice(7, temp.length)
          temp = `${part1} loading="lazy" ${part2} `
        }
        return temp
      } catch (err) {
        if (!process.env.ENV !== 'prod') console.error(err)

        return str
      }
    },
    validateEmail (email) {
      try {
        const regex = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
        return regex.test(email.toLowerCase())
      } catch {
        return false
      }
    }
  }
}

export const linkAffiliate = {
  methods: {
    linkAffiliate () {
      if (!process.env.SIGN_UP) return

      this.$apollo.query({
        query: gql`
          query affiliateGetProfile {
            affiliateGetProfile {
              id
              affiliateReferrerId
            }
          }
        `,
        client: 'affiliateClient'
      })
        .then(data => {
          if (!get(data, 'data.affiliateGetProfile.affiliateReferrerId', null)) {
            this.doLinkAffiliate()
          } else {
            localStorage.setItem(`triedLinkedAffiliate_${this.$store.state.auth.user.attributes['custom:id']}`, 'true')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    doLinkAffiliate () {
      if (!process.env.SIGN_UP) return

      this.$apollo.mutate({
        mutation: gql`
          mutation linkToAffiliate {
            linkToAffiliate {
              success
            }
          }
        `,
        client: 'affiliateClient'
      })
        .catch(_ => {})
    }
  }
}

export const visibleColumnsHelper = {
  methods: {
    getSavedVersionedVisCols (name) {
      const colStr = localStorage.getItem(`${name}_${process.env.VERSION}`)
      return colStr ? colStr.split(',') : null
    },
    saveVersionedVisCols (name, cols) {
      localStorage.setItem(`${name}_${process.env.VERSION}`, cols)
    }
  }
}
