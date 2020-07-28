import { getSkuIdentificator, getViewIdentificator } from './utils/formatHelper'
import { ProductOrder, PixelMessage, Order } from './typings/events'
import { canUseDOM } from 'vtex.render-runtime'
import push from './modules/push'

export default function () {
  return null
} // no-op for extension point

function handleMessages(e: PixelMessage) {
  let orderform = JSON.parse(window.localStorage.orderform);
  let identificator = window.identificator as string;
  switch (e.data.eventName) {

    case 'vtex:pageView': {
      push(["trackPageView"])
      push(["enableLinkTracking"])
      break
    }
    case 'vtex:orderPlaced': {
      const { currency,
        transactionTotal,
        orderGroup,
        transactionShipping,
        transactionTax,
        transactionProducts } = e.data
      transactionProducts.map((product: ProductOrder) => ([
        push([
          'addEcommerceItem',
          product.sku,
          product.category,
          product.quantity,
          product.sellingPrice
        ])
      ])
      )
      push([
        'trackEcommerceOrder',
        orderGroup,
        transactionTotal,
        (transactionTotal - transactionShipping),
        transactionTax,
        transactionShipping
      ]);
      push(['trackPageView']);
      break
    }
    case 'vtex:productView': {
      const { product: { categories, selectedSku } } = e.data
      push([
        'setEcommerceView',
        getViewIdentificator(selectedSku, identificator),
        selectedSku.name,
        categories[0].split("/").filter(Boolean),
        selectedSku.sellers[0].commertialOffer.Price
      ])
      push(['trackPageView'])
      break
    }
    case 'vtex:categoryView': {
      const { products } = e.data
      push(['setEcommerceView', false, false, products[0].categories.map(function (a) { return a.replace(/\//g, "") }).filter(Boolean)]);
      push(['trackPageView'])
      break
    }
    case 'vtex:departmentView': {
      const { products } = e.data
      push(['setEcommerceView', false, false, products[0].categories.map(function (a) { return a.replace(/\//g, "") }).filter(Boolean)]);
      push(['trackPageView'])
      break
    }
    case 'vtex:addToCart': {
      const { items } = e.data, { value } = orderform
      push(['addEcommerceItem',
        getSkuIdentificator(items, identificator),
        items[0].variant,
        items[0].category.split("/"),
        items.reduce((acc, val) => acc + val.price, 0) / 100,
        items[0].quantity
      ])
      push(['trackEcommerceCartUpdate', value / 100]);
      push(['trackPageView'])
      break
    }
    case 'vtex:removeFromCart': {
      const { items } = e.data, { value } = orderform
      push(['addEcommerceItem',
        getSkuIdentificator(items, identificator),
        items[0].variant,
        items[0].category.split("/"),
        items.reduce((acc, val) => acc + val.price, 0) / 100,
        items[0].quantity
      ])
      push(['trackEcommerceCartUpdate', value / 100]);
      push(['trackPageView'])
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}