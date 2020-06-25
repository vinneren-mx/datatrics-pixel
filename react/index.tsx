import { getProductPrice } from './utils/formatHelper'
import { ProductOrder, PixelMessage } from './typings/events'
import { canUseDOM } from 'vtex.render-runtime'

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
              //transactionDiscounts,
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
        transactionShipping,
        //transactionDiscounts
      ]);
      dpaq(['trackPageView']);
      break
    }
    case 'vtex:productView': {
      const { product:{productId, productName, categories, sku, items}, currency } = e.data
      dpaq([
        'setEcommerceView', 
        sku.itemID, 
        sku.name, 
        categories.slice(-1)[0], 
        sku.seller?.commertialOffer.Price
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
      dpaq(['setEcommerceView',false,false,products[0].categoryTree.slice(-1)[0]]);
      dpaq(['trackPageView'])
      break
    }
    case 'vtex:addToCart': {
      const { items, currency } = e.data
      dpaq(['addEcommerceItem',
        items.map(sku => sku.skuId),
        items.map(sku => sku.name),
        items.map(sku => sku.name),
        items.reduce((acc, item) => acc + item.price, 0),
        items.map(sku => sku.quantity)
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
