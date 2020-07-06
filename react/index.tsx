import { getProductPrice } from './utils/formatHelper'
import { ProductOrder, PixelMessage, Order } from './typings/events'
import { canUseDOM } from 'vtex.render-runtime'
import push from './modules/push'

export default function() {
  return null
} // no-op for extension point

function handleMessages(e: PixelMessage) {
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
      transactionProducts.map((product: ProductOrder,i) => ([
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
      const { product:{productId, productName, categories, items}, currency } = e.data
      push([
        'setEcommerceView', 
        productId, 
        productName, 
        categories.reverse(),
        items[0].sellers[0].commertialOffer.Price
      ])
      push(['trackPageView'])
      break
    }
    case 'vtex:categoryView':{
      const { products } = e.data
      push(['setEcommerceView',false,false,products[0].categories.reverse()]);
      push(['trackPageView'])
      break
    }
    case 'vtex:departmentView':{
      const { products } = e.data
      push(['setEcommerceView',false,false,products[0].categories]);
      push(['trackPageView'])
      break
    }
    case 'vtex:addToCart': {
      const { items, currency } = e.data
      console.log('datatrics', e)
      push(['addEcommerceItem',
        items.map(sku => sku.skuId).slice(-1)[0],
        items.map(sku => sku.variant).slice(-1)[0],
        items.map(sku => sku.category).slice(-1)[0],
        items.reduce((acc, item) => acc + item.price, 0) /100,
        items.map(sku => sku.quantity).slice(-1)[0]
      ])
      push(['trackEcommerceCartUpdate', '']);
      push(['trackPageView'])
      break
    }
    case 'vtex:removeFromCart': {
      const { items, currency } = e.data
      console.log(items)
      push(['addEcommerceItem',
        items.map(sku => sku.skuId).slice(-1)[0],
        items.map(sku => sku.variant).slice(-1)[0],
        items.map(sku => sku.category).slice(-1)[0],
        items.reduce((acc, item) => acc + item.price, 0) /100,
        items.map(sku => sku.quantity).slice(-1)[0]
      ])
      push(['trackEcommerceCartUpdate', '']);
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
function getPurchaseObjectData(order: Order) {
  return order.transactionTotal
  
}

