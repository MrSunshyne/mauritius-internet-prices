/* 

//INPUT
API_KEY
SHEET_ID
SHEET_NAME(optional)

// Returns
headers
items(formatter as { header: value }
loading ref

*/

import { ref, reactive, Ref } from "vue"
import { Row } from '@/types'

export default (API_KEY: string = 'xxx', SHEET_ID: string = 'yyy', SHEET_NAME: string = 'Sheet1') => {

  const loading: Ref<boolean> = ref(true)
  let headers: string[] = reactive([])
  let items = reactive([]) as Row[]


  function formatter(input: string[]) {
    const entry = input

    let records = entry.splice(1, entry.length)
    let columns = entry[0].length

    for (let i = 0; i < columns; i++) {
      headers.push(entry[0][i])
    }

    for (let i = 0; i < records.length; i++) {
      const item = {} as I
      for (let j = 0; j < headers.length; j++) {
        item[headers[j]] = records[i][j]
      }
      items.push(item)
    }
  }


  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`)
    .then(res => res.json())
    .then(res => {
      loading.value = false
      formatter(res.values)
    }).catch(err => {
      console.log(err)
    })

  return {
    headers: readonly(headers),
    items: readonly(items),
    loading
  }

}