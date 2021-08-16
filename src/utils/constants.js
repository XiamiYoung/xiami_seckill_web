var baseContext = {
}
module.exports = {
	interface:{
		backend:{
			cloudEndpoint:"http://123.57.212.54:8000",
			localEndpoint:"http://localhost:8000"
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
			cancelled:'取消',
			succeeded:'成功',
			failed:'失败',
			error:'错误'
		}
	},
	exception:{
		"REST3005":"非登录状态"
	}
}
