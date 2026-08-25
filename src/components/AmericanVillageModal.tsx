import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Navigation,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Circle,
  Coffee,
  IceCream,
  UtensilsCrossed,
  Shirt,
  Store,
  Tag,
  Zap
} from 'lucide-react';

export interface AmericanVillageShop {
  id: string;
  name: string;
  category: 'specialty' | 'toys' | 'food';
  categoryLabel: string;
  openHours: string;
  description: string;
  locationArea: string;
  mustTryOrTip?: string;
  googleMapsUrl: string;
  isRecommended?: boolean;
  addedBy?: string;
  isVisited?: boolean;
}

// 美國村 Google 地標 / 熱門店家資料庫（供搜尋自動帶入完整資訊）
export interface GooglePlacePreset {
  name: string;
  category: 'specialty' | 'toys' | 'food';
  categoryLabel: string;
  openHours: string;
  locationArea: string;
  description: string;
  mustTryOrTip: string;
  googleMapsUrl: string;
  keywords: string[];
}

export const GOOGLE_AV_PRESETS: GooglePlacePreset[] = [
  {
    name: 'A&W Chatan (A&W 沖繩限定美式漢堡 北谷店)',
    category: 'food',
    categoryLabel: '美食・美式漢堡速食',
    openHours: '09:00 - 23:00',
    locationArea: 'American Depot 旁 (美濱2丁目)',
    description: '沖繩最具代表性的美式速食始祖！招牌 The A&W Burger、現炸圈圈薯條與無限續杯的麥根沙士 Root Beer。',
    mustTryOrTip: '推薦：Mozza Burger 莫札瑞拉漢堡、捲捲薯條、麥根沙士 float',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=A%26W+Chatan+American+Village',
    keywords: ['a&w', 'aw', '漢堡', '速食', '薯條', '麥根沙士', '美式漢堡', 'burger', 'chatan', 'a and w'],
  },
  {
    name: 'Red Lobster (紅龍蝦美式海鮮餐廳 北谷店)',
    category: 'food',
    categoryLabel: '美食・美式海鮮牛排',
    openHours: '11:00 - 22:00',
    locationArea: 'Depot Island Seaside 濱海旁',
    description: '經典美式海鮮餐廳，主打加拿大產地直送活龍蝦、海鮮義大利麵、美式烤生蠔與炭烤牛排，海景座位視野超讚。',
    mustTryOrTip: '推薦：清蒸/炭烤整隻活龍蝦、生蠔拼盤、巧達濃湯',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Red+Lobster+Okinawa+Chatan',
    keywords: ['red lobster', '紅龍蝦', '龍蝦', '海鮮', '生蠔', '牛排', 'lobster', 'seafood'],
  },
  {
    name: 'Taco Rice Cafe Kijimuna (歐姆蛋塔可飯創始店 北谷店)',
    category: 'food',
    categoryLabel: '美食・沖繩靈魂塔可飯',
    openHours: '11:00 - 22:00',
    locationArea: 'Depot Island C棟 2F',
    description: '沖繩超人氣歐姆蛋塔可飯（Omutaco）元祖名店！滑嫩綿密半熟歐姆蛋鋪在熱騰騰起司肉醬塔可飯上，美味絕頂。',
    mustTryOrTip: '推薦：酪梨歐姆蛋塔可飯、照燒起司塔可飯',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taco+Rice+Cafe+Kijimuna+Chatan',
    keywords: ['kijimuna', 'taco rice', '塔可飯', '歐姆蛋', '塔可', '沖繩美食', 'omutaco', '蛋包飯'],
  },
  {
    name: 'The Calif Kitchen Okinawa (加州風海景早午餐咖啡)',
    category: 'food',
    categoryLabel: '美食・海景網美早午餐',
    openHours: '08:00 - 22:00',
    locationArea: 'Depot Island Seaside 3F',
    description: '海景第一排超美加州風網美餐廳！露天陽台可俯瞰整個北谷海岸線，提供美式鬆餅、加州捲、墨西哥薄餅與熱帶冰沙。',
    mustTryOrTip: '推薦：海景露台座位、墨西哥起司薄餅、草莓舒芙蕾鬆餅',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Calif+Kitchen+Okinawa',
    keywords: ['calif kitchen', 'calif', '早午餐', '網美咖啡', '海景早午餐', '加州', 'brunch', 'pancake'],
  },
  {
    name: 'Chatan Burger Base Atabii’s (海景手工厚漢堡)',
    category: 'food',
    categoryLabel: '美食・海景手作美式漢堡',
    openHours: '11:00 - 21:00',
    locationArea: 'Depot Island Seaside 1F',
    description: '位於木棧濱海散步道旁，肉排現煎多汁厚實，外皮香脆麵包搭配香濃巧達起司與特調醬汁，戶外看海吃漢堡超享受。',
    mustTryOrTip: '推薦：Bacon Cheese Burger 培根起司堡、酪梨牛肉堡',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Burger+Base+Atabii%27s',
    keywords: ['atabii', 'burger base', '漢堡', '手作漢堡', '海景漢堡', '美式漢堡', 'atabiis'],
  },
  {
    name: 'Steak House 88 (88牛排 北谷美國村店)',
    category: 'food',
    categoryLabel: '美食・沖繩老字號牛排',
    openHours: '11:00 - 22:00',
    locationArea: 'Depot Island A棟 2F',
    description: '沖繩無人不知的傳奇老字號牛排館！鐵板滋滋作響的厚切牛排、石垣牛與沙拉湯品無限供應。',
    mustTryOrTip: '推薦：特選沙朗牛排、石垣牛極上牛排、蒜香奶油醬',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Steak+House+88+Chatan',
    keywords: ['steak house 88', '88牛排', '牛排', 'steak', '88', '石垣牛', '鐵板牛排'],
  },
  {
    name: 'JUMBO STEAK HAN’S (漢斯大牛排 美國村店)',
    category: 'food',
    categoryLabel: '美食・大份量炭烤牛排',
    openHours: '11:00 - 22:00',
    locationArea: 'American Depot 2F',
    description: '美式豪邁厚切巨無霸牛排專賣店，主打炭烤 1 磅大牛排與香烤龍蝦排拼盤，肉控必訪。',
    mustTryOrTip: '推薦：1 Pound 炭烤厚切牛排、龍蝦牛排海陸雙拼',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=HAN%27S+Steak+Chatan+American+Village',
    keywords: ['hans', 'han', '漢斯牛排', '牛排', '大牛排', '炭烤牛排', 'steak'],
  },
  {
    name: 'Jolly Pasta (義大利麵 & 窯烤披薩 北谷店)',
    category: 'food',
    categoryLabel: '美食・平價義大利麵披薩',
    openHours: '11:00 - 24:00',
    locationArea: '美國村周邊 (美濱1丁目)',
    description: '日本超人氣連鎖義大利麵專賣店，提供上百種海鮮、奶油、番茄及明太子義大利麵與薄脆窯烤披薩。',
    mustTryOrTip: '推薦：蒜香海鮮義大利麵、明太子花枝麵、松露野菇披薩',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jolly+Pasta+Chatan',
    keywords: ['jolly pasta', 'jolly', '義大利麵', '披薩', 'pasta', 'pizza'],
  },
  {
    name: 'Ramen Hayate (沖繩風雲/疾風拉麵 北谷店)',
    category: 'food',
    categoryLabel: '美食・道地豚骨拉麵',
    openHours: '11:30 - 22:00',
    locationArea: '美國村外圍商圈',
    description: '濃郁豚骨湯頭搭配特製極細拉麵、厚切叉燒肉與黃金煎餃，逛街逛累後的宵夜與正餐首選。',
    mustTryOrTip: '推薦：特製黑蒜油豚骨拉麵、辛味噌拉麵、煎餃',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramen+Chatan+American+Village',
    keywords: ['ramen', '拉麵', '豚骨拉麵', '風雲拉麵', '疾風拉麵', '日本拉麵', '麵'],
  },
  {
    name: 'Magic Ocean (魔術海酒吧劇場 / 美式餐廳)',
    category: 'food',
    categoryLabel: '美食・魔術秀餐酒館',
    openHours: '18:00 - 23:00 (演出時間請見官網)',
    locationArea: 'Depot Island A棟 3F',
    description: '結合世界級魔術師近距離互動表演與特色調酒、披薩炸物，美國村最歡樂驚豔的夜間娛樂體驗！',
    mustTryOrTip: '推薦：魔術互動調酒、美式派對炸物拼盤（需提早預約）',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Magic+Ocean+Okinawa',
    keywords: ['magic ocean', 'magic', '魔術', '魔術酒吧', '餐酒館', '表演', '酒吧'],
  },
  {
    name: 'Starbucks Coffee (星巴克 北谷國道58號店)',
    category: 'food',
    categoryLabel: '美食・美式經典咖啡',
    openHours: '07:00 - 23:00',
    locationArea: '美國村入口 (國道58號旁)',
    description: '寬敞舒適的雙層美式星巴克，專賣沖繩限定 Been There 系列隨行杯、風獅爺馬克杯與季節飲品。',
    mustTryOrTip: '推薦：沖繩限定紀念馬克杯、冷萃咖啡',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Starbucks+Coffee+Chatan+Route+58',
    keywords: ['starbucks', '星巴克', '咖啡', '星巴克杯', '隨行杯', 'coffee'],
  },
  {
    name: 'Christmas Land (全年無休聖誕村主題旗艦店)',
    category: 'toys',
    categoryLabel: '玩具・聖誕奇幻選品',
    openHours: '11:00 - 20:00',
    locationArea: 'Depot Island Seaside 1F',
    description: '全日本極罕見全年 365 天都是聖誕節的主題店！專賣世界各國精緻雪花球、胡桃鉗木偶、聖誕樹吊飾與發光音樂盒。',
    mustTryOrTip: '推薦：限定雪花球、德國手工胡桃鉗娃娃、聖誕音樂盒',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Christmas+Land+Chatan+Okinawa',
    keywords: ['christmas land', 'christmas', '聖誕', '聖誕樹', '雪花球', '胡桃鉗', '玩具', '音樂盒', '聖誕節'],
  },
  {
    name: 'Tengu & Gashapon Figure Shop (動漫公仔扭蛋專賣店)',
    category: 'toys',
    categoryLabel: '玩具・日本動漫模型手辦',
    openHours: '10:00 - 21:00',
    locationArea: 'Depot Island 2F',
    description: '日本超人氣動漫周邊、吉伊卡哇、航海王、寶可夢、鬼滅之刃正版景品、手辦公仔與限定扭蛋。',
    mustTryOrTip: '推薦：日本最新一番賞、限定手辦、吉伊卡哇玩偶',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Depot+Island+Figure+Shop',
    keywords: ['公仔', '手辦', '模型', '動漫', '一番賞', '吉伊卡哇', '航海王', 'figure', 'anime', '玩具'],
  },
  {
    name: 'Capsule Toy Garden (百台扭蛋樂園)',
    category: 'toys',
    categoryLabel: '玩具・日本巨型扭蛋牆',
    openHours: '10:00 - 22:00',
    locationArea: 'Carnival Park 1F / 連通道',
    description: '排排站壯觀的數百台扭蛋機！囊括日本最新可愛動物、食物模型、微縮景觀與沖繩名產造型扭蛋。',
    mustTryOrTip: '推薦：沖繩限定名產吊飾扭蛋、貓福珊迪扭蛋',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Depot+Island+Gashapon',
    keywords: ['扭蛋', 'gashapon', '轉蛋', '扭蛋機', 'capsule toy', '玩具'],
  },
  {
    name: 'OKINAWAn SOUVENIR SHOP (沖繩名產御菓子殿堂)',
    category: 'specialty',
    categoryLabel: '特色小店・名產伴手禮',
    openHours: '10:00 - 21:30',
    locationArea: 'American Depot 1F',
    description: '匯集全沖繩最具代表性的伴手禮！紅芋蛋塔、雪鹽金楚糕、石垣島辣油、黑糖點心與泡盛酒專賣。',
    mustTryOrTip: '推薦：御菓子御殿紅芋塔、雪鹽夾心餅乾、風獅爺裝飾品',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=American+Depot+Souvenir+Shop',
    keywords: ['伴手禮', '名產', '紅芋塔', '雪鹽', '黑糖', '泡盛', '紀念品', 'souvenir', '御菓子御殿'],
  },
  {
    name: 'Island Spirit (沖繩琉球玻璃魂手作開運飾品)',
    category: 'specialty',
    categoryLabel: '特色小店・琉球玻璃手作',
    openHours: '11:00 - 21:00',
    locationArea: 'Depot Island 1F',
    description: '結合傳統琉球吹製玻璃與銀飾設計的幸運開運吊墜與手鍊，深受日本藝人喜愛，每種顏色代表不同祝福。',
    mustTryOrTip: '推薦：海藍色琉球玻璃幸運吊墜、手作純銀手鍊',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Island+Spirit+Chatan',
    keywords: ['island spirit', '琉球玻璃', '飾品', '手鍊', '項鍊', '開運', '玻璃'],
  },
  {
    name: 'Billabong / Hurley (美式衝浪潮流旗艦店)',
    category: 'specialty',
    categoryLabel: '特色小店・美式衝浪服飾',
    openHours: '11:00 - 20:00',
    locationArea: 'Depot Island 1F',
    description: '美式西海岸衝浪與滑板休閒服飾，專賣沖繩限定衝浪 T-shirt、海灘褲、防水包與戶外防曬帽。',
    mustTryOrTip: '推薦：沖繩限定配色衝浪 T 恤、海灘拖鞋',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Billabong+Chatan+Depot+Island',
    keywords: ['billabong', 'hurley', '衝浪', '海灘褲', '服飾', '潮牌', 'surf', '衣服'],
  },
  {
    name: 'Sunset Beach (美國村日落海灘步道)',
    category: 'specialty',
    categoryLabel: '特色小店・落日海景地標',
    openHours: '全天 24 小時開放 (海灘設施開放至日落)',
    locationArea: '美國村最西側海濱 (Vessel Hotel 旁)',
    description: '沖繩著名的落日夕陽觀賞勝地！沿著木棧散步道漫步，金黃夕陽染紅海面，夜晚還有沿岸浪漫夜景燈飾。',
    mustTryOrTip: '推薦：傍晚 17:30 - 18:30 前往看夕陽染紅海面！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Sunset+Beach',
    keywords: ['sunset beach', '日落海灘', '夕陽', '海灘', '散步', '海景', 'sunset', 'beach'],
  },
];

// 精選預設推薦店家清單
export const RECOMMENDED_AV_SHOPS: AmericanVillageShop[] = [
  // --- 特色小店 ---
  {
    id: 'av-snoopy',
    name: "Snoopy's Surf Shop (沖繩限定衝浪史努比)",
    category: 'specialty',
    categoryLabel: '特色小店・限定服飾',
    openHours: '11:00 - 20:00 (以現場公告為準)',
    description: '全沖繩唯一官方授權衝浪風史努比！專賣沖繩限定衝浪圖案 T-shirt、帽子、帆布袋、貼紙與可愛紀念小物。',
    locationArea: 'Depot Island Seaside 1F',
    mustTryOrTip: '沖繩限定曬黑版衝浪史努比短T超搶手！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Snoopy+Surf+Shop+Okinawa+Chatan',
    isRecommended: true,
  },
  {
    id: 'av-americandepot',
    name: 'American Depot (美式古著軍品巨型旗艦店)',
    category: 'specialty',
    categoryLabel: '特色小店・美式古著',
    openHours: '10:00 - 21:00',
    description: '美國村最具代表性的地標選品店，販售美軍公發古著、牛仔褲、工裝靴、美式車牌與復古鐵牌裝飾。',
    locationArea: 'American Depot 本館',
    mustTryOrTip: '門口巨型美國大兵公仔是超經典拍照打卡點！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=American+Depot+Okinawa',
    isRecommended: true,
  },
  {
    id: 'av-villagehouse',
    name: 'Village House (美式復古古著 & 雜貨選品)',
    category: 'specialty',
    categoryLabel: '特色小店・復古雜貨',
    openHours: '11:00 - 21:00',
    description: '美式西海岸復古氛圍選物店，陳列大量美式古著襯衫、工裝、美軍軍品風配件與獨特手作飾品。',
    locationArea: 'American Depot A棟 1F',
    mustTryOrTip: '喜歡美式復古古著挖寶必逛！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Village+House+American+Village',
    isRecommended: true,
  },
  {
    id: 'av-splash',
    name: 'Splash Okinawa (沖繩海島風貝殼雜貨飾品)',
    category: 'specialty',
    categoryLabel: '特色小店・海島文創',
    openHours: '11:00 - 21:00',
    description: '以沖繩海洋、貝殼、珊瑚與扶桑花為設計靈感的粉嫩文創雜貨店，充滿質感香氛、首飾與收納包。',
    locationArea: 'Depot Island Building D 1F',
    mustTryOrTip: '超適合買送給女生朋友或自己的精緻紀念品！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Splash+Okinawa+Chatan',
    isRecommended: true,
  },

  // --- 玩具 ---
  {
    id: 'av-gashapon',
    name: 'Depot Island 扭蛋專門區 (Gashapon Station)',
    category: 'toys',
    categoryLabel: '玩具・日本扭蛋專賣',
    openHours: '10:00 - 21:00',
    description: '匯集上百台最新日本動漫、吉伊卡哇、寶可夢、貓福珊迪與沖繩限定觀光扭蛋機，扭蛋控必訪！',
    locationArea: 'Depot Island 建築群連通道',
    mustTryOrTip: '沖繩限定名產造型扭蛋、人氣角色最新機台',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Depot+Island+American+Village+Okinawa',
    isRecommended: true,
  },
  {
    id: 'av-americantoys',
    name: 'American Depot 復古美式玩具公仔區',
    category: 'toys',
    categoryLabel: '玩具・美式復古公仔',
    openHours: '10:00 - 21:00',
    description: '大型美式老玩具專區，陳列美式英雄、星際大戰、迪士尼復古公仔、老式鐵皮玩具與可口可樂絕版擺飾。',
    locationArea: 'American Depot 本館 1F/2F',
    mustTryOrTip: '超多絕版懷舊美式老玩具公仔可以挖寶！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=American+Depot+Okinawa',
    isRecommended: true,
  },
  {
    id: 'av-pokemon',
    name: 'Pokémon 飛翔皮卡丘官方彩繪打卡區',
    category: 'toys',
    categoryLabel: '玩具・寶可夢打卡點',
    openHours: '全天 24 小時開放 (戶外)',
    description: '官方「飛翔皮卡丘計畫」打卡地標！包含扶桑花皮卡丘彩繪牆、寶可夢彩繪人孔蓋（Pokéfuta）與造型拍照點。',
    locationArea: 'Depot Island 濱海散步道周邊',
    mustTryOrTip: '尋找街頭牆面隱藏的皮卡丘與人孔蓋拍照留念！',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Depot+Island+Pokemon',
    isRecommended: true,
  },

  // --- 美食 ---
  {
    id: 'av-blueseal',
    name: 'Blue Seal Ice Cream (美國村海景旗艦店)',
    category: 'food',
    categoryLabel: '美食・沖繩代表冰淇淋',
    openHours: '10:00 - 22:00',
    description: '沖繩經典冰淇淋，店外有超好拍復古霓虹燈看板與戶外露天座位，邊吃冰邊看海濱夕陽。',
    locationArea: 'Depot Island Seaside 2F',
    mustTryOrTip: '推薦：沖繩紅芋、鹽金楚糕、香檬金桔雪酪',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Seal+Chatan+Depot+Island',
    isRecommended: true,
  },
  {
    id: 'av-porktamago',
    name: 'ポークたまごおにぎり (北谷店 豬肉蛋飯糰)',
    category: 'food',
    categoryLabel: '美食・人氣靈魂小吃',
    openHours: '07:00 - 19:00',
    description: '沖繩必吃平民美食！現點現做熱騰騰厚煎午餐肉搭配軟嫩玉子燒與香脆海苔，北谷店專賣特色口味。',
    locationArea: 'Depot Island Seaside 1F',
    mustTryOrTip: '炸蝦塔塔醬飯糰、苦瓜天婦羅飯糰',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pork+Tamago+Onigiri+Chatan',
    isRecommended: true,
  },
  {
    id: 'av-zhyvago',
    name: 'ZHYVAGO COFFEE WORKS / ROASTERY',
    category: 'food',
    categoryLabel: '美食・海景精品咖啡',
    openHours: '07:00 - 22:00',
    description: '西海岸工業風極致時髦海景咖啡館！戶外木棧道看夕陽海景，搭配現烘義式拿鐵與美式肉桂捲。',
    locationArea: 'Depot Island Boardwalk 濱海步道旁',
    mustTryOrTip: '必點冰燕麥奶拿鐵與手工現烤肉桂捲',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=ZHYVAGO+COFFEE+WORKS+OKINAWA',
    isRecommended: true,
  },
  {
    id: 'av-hanon',
    name: 'Seaside Cafe Hanon (海景舒芙蕾厚鬆餅)',
    category: 'food',
    categoryLabel: '美食・海景甜點名店',
    openHours: '11:00 - 19:00 (週末 09:00 - 19:00)',
    description: '海景第一排超人氣舒芙蕾厚鬆餅！口感蓬鬆軟綿如雲朵，搭配沖繩海風與海景極度放鬆。',
    locationArea: 'Oak Fashion Building 2F',
    mustTryOrTip: '紅芋蒙布朗舒芙蕾、焦糖海鹽厚鬆餅',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Seaside+Cafe+Hanon+Chatan',
    isRecommended: true,
  },
  {
    id: 'av-chatanharbor',
    name: 'Chatan Harbor Brewery & Restaurant',
    category: 'food',
    categoryLabel: '美食・海景精釀啤酒餐廳',
    openHours: '11:00 - 22:00 (最後點餐 21:00)',
    description: '北谷在地精釀啤酒廠！提供鮮釀生啤酒與窯烤披薩、炭烤阿古豬排，可一邊看落日晚霞一邊小酌。',
    locationArea: 'Chatan Fisherina 港灣區',
    mustTryOrTip: 'Orion 或在地鮮釀 IPA 啤酒 + 炭烤海鮮拼盤',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chatan+Harbor+Brewery',
    isRecommended: true,
  },
];

interface AmericanVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmericanVillageModal: React.FC<AmericanVillageModalProps> = ({
  isOpen,
  onClose,
}) => {
  // 使用者自訂新增的店家列表（使用 localStorage 永久保存）
  const [customShops, setCustomShops] = useState<AmericanVillageShop[]>(() => {
    try {
      const saved = localStorage.getItem('okinawa_av_custom_shops');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 已踩點/打勾標記
  const [visitedShopIds, setVisitedShopIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('okinawa_av_visited_shops');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 新增表單狀態
  const [isAdding, setIsAdding] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState<'specialty' | 'toys' | 'food'>('specialty');
  const [newShopHours, setNewShopHours] = useState('');
  const [newShopLocation, setNewShopLocation] = useState('');
  const [newShopNote, setNewShopNote] = useState('');
  const [customGoogleMapsUrl, setCustomGoogleMapsUrl] = useState('');
  const [autoFilledSuccess, setAutoFilledSuccess] = useState<string | null>(null);

  // 篩選分類 (all, specialty, toys, food)
  const [activeFilter, setActiveFilter] = useState<'all' | 'specialty' | 'toys' | 'food'>('all');

  // 保存 customShops 到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('okinawa_av_custom_shops', JSON.stringify(customShops));
    } catch (err) {
      console.error(err);
    }
  }, [customShops]);

  // 保存 visitedShopIds 到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('okinawa_av_visited_shops', JSON.stringify(visitedShopIds));
    } catch (err) {
      console.error(err);
    }
  }, [visitedShopIds]);

  if (!isOpen) return null;

  // 結合所有店家
  const allShops: AmericanVillageShop[] = [...RECOMMENDED_AV_SHOPS, ...customShops];

  // 篩選後店家
  const filteredShops = allShops.filter((shop) => {
    if (activeFilter === 'all') return true;
    return shop.category === activeFilter;
  });

  // 根據輸入名稱即時尋找 Google 預設匹配店家
  const matchingGooglePresets = newShopName.trim().length > 0
    ? GOOGLE_AV_PRESETS.filter((preset) => {
        const query = newShopName.trim().toLowerCase();
        return (
          preset.name.toLowerCase().includes(query) ||
          preset.keywords.some((k) => k.toLowerCase().includes(query)) ||
          preset.locationArea.toLowerCase().includes(query) ||
          preset.categoryLabel.toLowerCase().includes(query)
        );
      }).slice(0, 4)
    : [];

  // 點擊 Google 匹配店家，一鍵自動填入所有欄位
  const handleSelectPreset = (preset: GooglePlacePreset) => {
    setNewShopName(preset.name);
    setNewShopCategory(preset.category);
    setNewShopHours(preset.openHours);
    setNewShopLocation(preset.locationArea);
    setNewShopNote(preset.mustTryOrTip || preset.description);
    setCustomGoogleMapsUrl(preset.googleMapsUrl);
    setAutoFilledSuccess(preset.name);

    setTimeout(() => {
      setAutoFilledSuccess(null);
    }, 4000);
  };

  // 切換已踩點
  const toggleVisited = (id: string) => {
    setVisitedShopIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 新增自訂店家
  const handleAddShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;

    const trimmedName = newShopName.trim();
    const mapUrl = customGoogleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `American Village Okinawa ${trimmedName}`
    )}`;

    const categoryLabelMap: Record<'specialty' | 'toys' | 'food', string> = {
      specialty: '特色小店',
      toys: '玩具選物',
      food: '美食餐廳',
    };

    const newShop: AmericanVillageShop = {
      id: `custom-av-${Date.now()}`,
      name: trimmedName,
      category: newShopCategory,
      categoryLabel: categoryLabelMap[newShopCategory] || '自訂店家',
      openHours: newShopHours.trim() || '依店家現場公告',
      description: newShopNote.trim() || '大家推薦想逛的口袋名單，自由時間前往探索！',
      locationArea: newShopLocation.trim() || '美國村周邊',
      mustTryOrTip: newShopNote.trim() ? `備註：${newShopNote.trim()}` : undefined,
      googleMapsUrl: mapUrl,
      isRecommended: false,
    };

    setCustomShops((prev) => [newShop, ...prev]);
    setNewShopName('');
    setNewShopCategory('specialty');
    setNewShopHours('');
    setNewShopLocation('');
    setNewShopNote('');
    setCustomGoogleMapsUrl('');
    setAutoFilledSuccess(null);
    setIsAdding(false);
  };

  // 刪除自訂店家
  const handleDeleteCustomShop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除此筆自訂店家嗎？')) {
      setCustomShops((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg sm:max-w-xl max-h-[85vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="關閉"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
              🎡 CHATAN AMERICAN VILLAGE
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-sky-100">
              共 {allShops.length} 家好店
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight">
            美國村・想逛店家清單 & 導航
          </h2>
          <p className="text-[11px] sm:text-xs text-sky-100 mt-1 font-medium leading-relaxed">
            自由時間探索！可查閱推薦名店營業時間與 Google 導航，亦可隨時新增想逛店家。
          </p>
        </div>

        {/* Action Bar: Category Tabs + Add Button */}
        <div className="p-2.5 sm:px-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-1.5 flex-wrap shrink-0">
          {/* Tabs: 全部、特色小店、玩具、美食 */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
              }`}
            >
              全部 ({allShops.length})
            </button>
            <button
              onClick={() => setActiveFilter('specialty')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shrink-0 ${
                activeFilter === 'specialty'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
              }`}
            >
              🎪 特色小店 ({allShops.filter((s) => s.category === 'specialty').length})
            </button>
            <button
              onClick={() => setActiveFilter('toys')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shrink-0 ${
                activeFilter === 'toys'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
              }`}
            >
              🧸 玩具 ({allShops.filter((s) => s.category === 'toys').length})
            </button>
            <button
              onClick={() => setActiveFilter('food')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shrink-0 ${
                activeFilter === 'food'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
              }`}
            >
              🍔 美食 ({allShops.filter((s) => s.category === 'food').length})
            </button>
          </div>

          {/* Add Shop Trigger Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 bg-[#ef652d] hover:bg-[#de561f] text-white text-[11px] sm:text-xs font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl shadow-xs transition-all shrink-0 active:scale-95 ml-auto"
          >
            <span>{isAdding ? '收起' : '新增店家'}</span>
          </button>
        </div>

        {/* Collapsible Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-sky-50/90 border-b border-sky-100 p-4 sm:p-5 overflow-hidden shrink-0"
            >
              <form onSubmit={handleAddShop} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-sky-600" />
                    <span>新增店家（輸入名稱自動搜尋 Google 地標與店家資訊）</span>
                  </span>
                  <span className="text-[11px] text-sky-700 font-bold">
                    送出後自動生成 Google 導航
                  </span>
                </div>

                {/* Auto-filled Success Alert */}
                {autoFilledSuccess && (
                  <div className="bg-emerald-100/90 border border-emerald-300 rounded-xl p-2.5 px-3 flex items-center gap-2 text-xs font-black text-emerald-900 animate-in fade-in">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="truncate">
                      已自動帶入「{autoFilledSuccess}」的所有營業資訊與地圖！
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      店家名稱 <span className="text-rose-500">*</span>
                      <span className="text-[10px] text-sky-600 font-medium ml-1">
                        (打字即時匹配 Google 美國村好店)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="例：A&W、Red Lobster、聖誕村、牛排、拉麵、扭蛋..."
                        value={newShopName}
                        onChange={(e) => setNewShopName(e.target.value)}
                        className="w-full text-xs font-bold bg-white border border-sky-200 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-sky-500"
                      />
                      {newShopName && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewShopName('');
                            setAutoFilledSuccess(null);
                          }}
                          className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      店家分類 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={newShopCategory}
                      onChange={(e) => setNewShopCategory(e.target.value as 'specialty' | 'toys' | 'food')}
                      className="w-full text-xs font-bold bg-white border border-sky-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                    >
                      <option value="specialty">🎪 特色小店 (服飾選物/雜貨文創)</option>
                      <option value="toys">🧸 玩具 (公仔/扭蛋/動漫/寶可夢)</option>
                      <option value="food">🍔 美食 (甜點冰品/海景咖啡/餐廳)</option>
                    </select>
                  </div>
                </div>

                {/* Instant Google Preset Matches Dropdown */}
                {matchingGooglePresets.length > 0 && (
                  <div className="bg-white border border-sky-200 rounded-2xl p-2.5 shadow-sm space-y-1.5 animate-in fade-in">
                    <div className="text-[10px] font-black text-sky-800 flex items-center gap-1 px-1">
                      <Zap size={11} className="text-amber-500" />
                      <span>找到 {matchingGooglePresets.length} 個 Google 推薦店家（點擊直接帶入全部資訊）：</span>
                    </div>

                    <div className="space-y-1">
                      {matchingGooglePresets.map((preset, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => handleSelectPreset(preset)}
                          className="p-2 hover:bg-sky-50 rounded-xl cursor-pointer border border-transparent hover:border-sky-200 transition-all flex items-center justify-between gap-2 text-left group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-900 group-hover:text-sky-700 truncate">
                                {preset.name}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  preset.category === 'specialty'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : preset.category === 'toys'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {preset.categoryLabel}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                              📍 {preset.locationArea} ｜ ⏰ {preset.openHours}
                            </div>
                          </div>

                          <span className="shrink-0 bg-sky-600 group-hover:bg-sky-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                            <Zap size={10} />
                            <span>自動帶入</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      營業時間 (選填)
                    </label>
                    <input
                      type="text"
                      placeholder="例：11:00 - 21:00、10:00 - 22:00"
                      value={newShopHours}
                      onChange={(e) => setNewShopHours(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-sky-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      所在區域 / 樓層 (選填)
                    </label>
                    <input
                      type="text"
                      placeholder="例：Depot Island Seaside 2F、濱海步道"
                      value={newShopLocation}
                      onChange={(e) => setNewShopLocation(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-sky-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setAutoFilledSuccess(null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black bg-[#ef652d] hover:bg-[#de561f] text-white shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>儲存</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {filteredShops.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Store size={32} className="mx-auto mb-2 opacity-50 text-slate-300" />
              <p className="text-xs sm:text-sm font-bold text-slate-500">目前沒有符合此分類的店家</p>
              <p className="text-[11px] text-slate-400 mt-0.5">點擊上方「＋ 新增店家」建立專屬清單！</p>
            </div>
          ) : (
            filteredShops.map((shop, index) => {
              return (
                <div key={shop.id}>
                  <div className="py-4 sm:py-5 first:pt-1 group transition-all">
                    <div className="flex items-start justify-between gap-3">
                      {/* Landmark Icon Pin */}
                      <div className="mt-0.5 w-7 h-7 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <MapPin size={15} />
                      </div>

                      {/* Main Shop Details */}
                      <div className="flex-1 min-w-0">
                        {/* Badge Row */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span
                            className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                              shop.isRecommended
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {shop.isRecommended ? '🌟 精選推薦' : '📝 自訂店家'}
                          </span>

                          <span
                            className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                              shop.category === 'specialty'
                                ? 'bg-indigo-100 text-indigo-800'
                                : shop.category === 'toys'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {shop.categoryLabel}
                          </span>

                          {shop.locationArea && (
                            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                              <span className="truncate max-w-[120px] sm:max-w-none">{shop.locationArea}</span>
                            </span>
                          )}
                        </div>

                        {/* Shop Name */}
                        <h4 className="text-sm sm:text-base font-black tracking-tight leading-snug text-slate-900">
                          {shop.name}
                        </h4>

                        {/* Open Hours */}
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-sky-700 mt-1">
                          <Clock size={12} className="text-sky-500 shrink-0" />
                          <span>營業時間：{shop.openHours}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
                          {shop.description}
                        </p>

                        {/* Tip or Must Try */}
                        {shop.mustTryOrTip && (
                          <div className="mt-2 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2 px-2.5 text-[10px] sm:text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                            <span>✨</span>
                            <span>{shop.mustTryOrTip}</span>
                          </div>
                        )}

                        {/* Bottom Action: Google Map Navigation */}
                        <div className="flex items-center justify-between gap-2 mt-3 pt-1">
                          <a
                            href={shop.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-[#0090d3] hover:bg-sky-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
                          >
                            <Navigation size={12} />
                            <span>Google 導航</span>
                            <ExternalLink size={10} className="opacity-80" />
                          </a>

                          {/* Delete button if custom */}
                          {!shop.isRecommended && (
                            <button
                              onClick={(e) => handleDeleteCustomShop(shop.id, e)}
                              className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 px-2 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                              <span>刪除</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 分隔線 (增加留白距離，最後一項不加底線) */}
                  {index < filteredShops.length - 1 && (
                    <hr className="border-t border-slate-100 my-1" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 sm:px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0">
          <span className="truncate pr-2">💡 點擊「Google 導航」可直接開啟地圖前往店家。</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition-colors shrink-0 text-xs"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
