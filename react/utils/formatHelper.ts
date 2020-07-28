import { Product, Item, } from '../typings/events'

export function getProductPrice(product: Product) {
  let price
  try {
    price = product.items[0].sellers[0].commertialOffer.Price
  } catch {
    price = undefined
  }
  return price
}
export function getSkuIdentificator(item: Item[], selected: string) {
  let dataId
  try {
    dataId = item[0][selected] !== undefined ? item[0][selected] : item[0].skuId
  } catch {
    dataId = item[0].skuId
  }
  return dataId
}

export function getViewIdentificator(selectedSku: Item, selected: string) {
  let dssku = selectedSku.itemId
  if (selected === "referenceId") {
    try {
      dssku = selectedSku.referenceId[0].Value !== undefined ? selectedSku.referenceId[0].Value : selectedSku.itemId
    } catch {
      dssku = selectedSku.itemId
    }
  } else {
    try {
      dssku = selectedSku[selected] !== undefined ? selectedSku[selected] : selectedSku.itemId
    } catch {
      dssku = selectedSku.itemId
    }
  }
  return dssku

}
