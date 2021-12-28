import { RenderFunction } from 'vue'

export interface MenuItem {
  name: string
  path: string
  icon: RenderFunction
}

export interface Row {
  ["Package"]: string
  ["Operator"]: string
  ["Duration(days)"]: string
  ["Volume (GB)"]: string
  ["Volume per day"]: string
  ["Cost(Rs)"]: string
  ["Cost(Rs) per day"]: string
  ["Cost per GB"]: string
  ["Source"]: string
}
