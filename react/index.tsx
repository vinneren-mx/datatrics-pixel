import { getProductPrice } from './utils/formatHelper'
import { ProductOrder, PixelMessage } from './typings/events'
import { canUseDOM } from 'vtex.render-runtime'

function dpaq(n: Array<any>): void {
  console.log('datatrics_data', n);
  ((window as any)._paq || []).push(n)
}

function handleMessages(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      dpaq(["trackPageView"])
      dpaq(["enableLinkTracking"])
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
          dpaq([
            'addEcommerceItem', 
            product.sku,
            product.category,
            product.quantity,
            product.sellingPrice
          ])
        ])
      )
      dpaq([
        'trackEcommerceOrder', 
        orderGroup,
        transactionTotal,
        (transactionTotal - transactionShipping),
        transactionTax,
        transactionShipping
      ]);
      dpaq(['trackPageView']);
      console.log('orderplaced')
      break
    }
    case 'vtex:productView': {
      const { product:{productId, productName, categories, items}, currency } = e.data
      dpaq([
        'setEcommerceView', 
        items[0].itemId, 
        items[0].name, 
        categories.slice(-1)[0], 
        items[0].seller?.commertialOffer.Price
      ])
      dpaq(['trackPageView'])
      break
    }
    case 'vtex:categoryView':{
      const { products } = e.data
      dpaq(['setEcommerceView',false,false,products[0].categoryTree.slice(-1)[0]]);
      dpaq(['trackPageView'])
      break
    }
    case 'vtex:departmentView':{
      const { products } = e.data
      dpaq(['setEcommerceView',false,false,products[0].categories.slice(-1)[0]]);
      dpaq(['trackPageView'])
      break
    }
    case 'vtex:addToCart': {
      const { items, currency } = e.data
      dpaq(['addEcommerceItem',
        items.map(sku => sku.skuId).slice(-1)[0],
        items.map(sku => sku.name).slice(-1)[0],
        items.map(sku => sku.name).slice(-1)[0],
        items.reduce((acc, item) => acc + item.price, 0) /100,
        items.map(sku => sku.quantity).slice(-1)[0]
      ])
      dpaq(['trackPageView'])
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
