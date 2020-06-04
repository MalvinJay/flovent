
import equal from 'fast-deep-equal'
import moment from 'moment'
export default {
  retryTransactions (row, type) {
    var form = {}
    var reference = ''

    if (row.reference.toLowerCase().startsWith('r')) {
      reference = row.reference
    } else {
      reference = `R${row.reference}`
    }

    if (type === 'payment') {
      form = {
        amount: row.receiver_amount,
        currency: 'GHS',
        customer_no: row.receiver_no,
        country_code: 'GH',
        reference: reference,
        customer_name: row.receiver_name,
        provider: row.provider,
        remarks: row.remarks,
        retry: true
      }
      form.service_code = 'cashout'
    } else {
      form = {
        sender_amount: row.sender_amount,
        sender_currency: 'GHS',
        recipient_amount: row.receiver_amount,
        recipient_currency: 'GHS',
        recipient_no: row.receiver_no,
        recipient_name: row.receiver_name,
        provider: row.provider_code,
        country_code: 'GH',
        service_code: 'cashin',
        reference: reference
      }
    }

    console.log('retry', form)
    return form
  },
  // debit payment
  createDebitFreq (schedule, job) {
    var newString = schedule
    console.log(schedule, job)
    switch (schedule) {
      case 'daily':
        newString = 1
        break
      case 'weekly':
        newString = this.returnDay(job.date)
        break
      case 'monthly':
        newString = moment(job.date).date()
        break
      case 'bimonthly':
        newString = moment(job.date).date()
        break
      case 'quarterly':
        newString = moment(job.date).date()
        break
      case 'yearly':
        newString = moment(job.date).date()
        break
      default:
        break
    }
    return newString
  },
  // debit payment
  createFreq (schedule, job) {
    var newString = schedule
    console.log(schedule, job)
    switch (schedule) {
      case 'daily':
        newString = 1
        break
      case 'weekly':
        newString = 1
        break
      case 'monthly':
        newString = 1
        break
      case 'bimonthly':
        newString = 2
        break
      case 'quarterly':
        newString = 4
        break
      case 'yearly':
        newString = 1
        break
      default:
        break
    }
    return newString
  },
  returnDay (value) {
    switch (value.toLowerCase()) {
      case 'monday':
        return 1
      case 'tuesday':
        return 2
      case 'wednesday':
        return 3
      case 'thursday':
        return 4
      case 'friday':
        return 5
      case 'saturday':
        return 6
      default:
        return 7
    }
  },

  //create query out of object
  createQueryFromObject (obj) {
    var query = ''
    Object.keys(obj).forEach(function (key) {
      query = typeof obj[key] === 'undefined' ? '' : query + `&${key}=${obj[key]}`
    })
    return query.substring(1)
  },
  createExportQuery (form) {
    var query = 'file_type=csv'

    if (this.present(form.from)) {
      query = query += `&from=${form.from}`
    }

    if (this.present(form.to)) {
      query = query += `&to=${form.to}`
    }

    // if (this.present(form.cash_flow)) {
    //   query = query += `&cash_flow=${form.cash_flow}`
    // }

    if (this.present(form.fields)) {
      if (form.fields.length === 1) {
        query += `&fields[]=${form.fields}`
      } else {
        form.fields.map((element)=>{
          query += `&fields[]=${element}`
        })
      }
    }

    // if (this.present(form.payment_types)) {
    //   if (form.payment_types.length === 1) {
    //     query = query += `&payment_types[]=${form.payment_types}`
    //   } else {
    //     var w = form.payment_types
    //     w.forEach(element => {
    //       query = query += `&payment_types[]=${element}`
    //     })
    //   }

    //   query = query += `&payment_types[]=${form.payment_types.join(',')}`
    // }

    return query
  },
  
  createQueryParams (filters, page = 1) {
    var query = `?page=${page}&limit=20`

    if (this.present(filters)) {
      if (this.present(filters.from) && this.present(filters.to)) {
        query = query + `&from=${filters.from}&to=${filters.to}`
      }
      if (this.present(filters.status)) {
        filters.status.map((el)=>{
          query = query + `&status[]=${el}`
        })
        // query = query + `&status[]=${filters.status}`
      }    
      if (this.empty(filters.from) && this.empty(filters.to) && this.empty(filters.status)) {
        query = query
      }
    } 
    else {
      query = query
    }
    
    console.log("Final Query:", query)
    return query
  },
  createPendingParams (filters, page = 1) {
    var query = `?page=${page}&limit=12`
    if (this.present(filters)) {
      if (this.present(filters.from) && this.present(filters.to)) {
        query = query + `&from=${filters.from}&to=${filters.to}`
      }
      if (this.present(filters.payment_types)) {
        query = query + `&payment_types[]=${filters.payment_types}`
      }
      if (this.present(filters.statuses)) {
        query = query + `&statuses[]=${filters.statuses}`
      }
      if (this.present(filters.search_value)) {
        query = query + `&search_value=${filters.search_value}`
      }
      if (this.present(filters.time_interval)) {
        query = query + `&time_interval=${filters.time_interval}`
      }
      if (this.present(filters.cash_flow)) {
        query = query + `&cash_flow=${filters.cash_flow}`
      }
    }
    return query
  },
  getChangedFields (obj, fields, original) {
    let retObj = {}
    fields.forEach(el => {
      if (!equal(obj[el], original[el])) {
        retObj[el] = obj[el]
      }
    })
    return retObj
  },
  createJobDetailsArray (form, fields) {
    var newQuery = ''
    fields.forEach(element => {
      newQuery = newQuery + `&${element}=${form[element]}`
    })
    return newQuery.substring(1)
  },
  present (value) {
    if (!value) {
      return false
    }
    if (typeof value === 'object') {
      if (Object.keys(value).length > 0) {
        return true
      }
      return false
    }
    if (Array.isArray(value) || typeof value === 'string') {
      return value && value.length > 0
    } else {
      return !!value
    }
  },
  empty (value) {
    return !this.present(value)
  },
  sum (arr) {
    console.log('arr', arr)
    if (arr.length === 0) {
      return 0
    } else {
      return arr.reduce((sum, x) => sum + x)
    }
  },
  addContactToJobQuery (batch) {
    var query = `batch_details[Key]=${batch.Key}&batch_details[Bucket]=flopay-batchstore`
    return query
  },
  createJobQuery (schedule, job) {
    var newString = schedule
    switch (schedule) {
      case 'daily':
        newString = `${newString} at ${job.time}`
        break
      case 'weekly':
        newString = `${job.time} every ${job.date}`
        break
      case 'monthly':
        newString = `every month at ${job.date}`
        break
      case 'bimonthly':
        newString = `every 2 months at ${job.date}`
        break
      case 'quarterly':
        newString = `every 3 months at ${job.date}`
        break
      case 'yearly':
        newString = `every year at ${job.date}`
        break
      default:
        break
    }
    return newString
  },
  randomString2 (l) {
    let text = ''
    let charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < l; i++) {
      text += charList.charAt(Math.floor(Math.random() * charList.length))
    }
    return text
  },
  returnBool (value) {
    if (value === 'true') {
      return true
    } else {
      return false
    }
  },
  capitalize (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }
}
