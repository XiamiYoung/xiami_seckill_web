var baseContext = {
}
module.exports = {
	interface:{
		backend:{
			endpoint:"http://localhost:8000"
		}
	},
	service:{
		jd:{
			headerPCCookieName:"jd-pc-cookies",
			headerMobileCookieName:"jd-mobile-cookies"
		},
		arrangementStatus:{
			planned:'未开始',
			running:'运行中',
			cancelled:'已取消',
			succeeded:'已成功',
			failed:'已失败',
			error:'系统错误'
		}
	},
	exception:{
		"REST3005":"非登录状态"
	}
}
