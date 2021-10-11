var baseContext = {
}
module.exports = {
	interface:{
		backend:{
			cloudEndpoint:"http://123.57.143.92:7366",
			localEndpoint:"http://localhost:7366"
		}
	},
	service:{
		jd:{
			headerPCCookieName:"jd-pc-cookies",
			headerMobileCookieName:"jd-mobile-cookies"
		},
		arrangementStatus:{
			planned:'计划',
			running:'运行',
			cancelled:'终止',
			succeeded:'成功',
			failed:'失败',
			error:'错误'
		}
	},
	exception:{
		"REST3002":"无效二维码",
		"REST3005":"非登录状态"
	}
}
