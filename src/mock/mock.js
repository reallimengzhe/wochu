// import Mock from 'mockjs';
// import url from "@/service.config.js";

// let Random = Mock.Random;
// let productData = req => {
//     console.log(req);
//     let recommendItemList = [];
//     for (let i = 0; i < 100; i++) {
//         let recommendItem = {
//             image: Random.dataImage('150x150', 'Product ' + Random.integer(1, 100)),
//             name: Random.ctitle(11, 16),
//             price: Random.float(2, 100, 1, 1) + '0'
//         }
//         recommendItemList.push(recommendItem)
//     }
//     return recommendItemList;
// }

// Mock.mock(url.getRecommendItem, productData)