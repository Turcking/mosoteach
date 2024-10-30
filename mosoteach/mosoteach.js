// ==UserScript==
// @name	www.mosoteach.cn video learning finish script
// @name:cn	云班课 www.mosoteach.cn 视频学习资源完成脚本
// @version	2024-09-13
// @author	Turcking
// @match	https://www.mosoteach.cn/*
// ==/UserScript==

(function (){

	function queryUnfinishedItems(){
		return document.querySelectorAll("div.res-row-box > div.hide-div > div.res-row-open-enable.res-row.preview.drag-res-row:has(div>span[data-is-drag=\"N\"])");
	}

	function getVideoInfo(element){
		let file_id = element.getAttribute("data-value"):
		let clazz_course_id = new URL(window.location.toString()).searchParams.get("clazz_course_id");
		return fetch("https://www.mosoteach.cn/web/index.php?c=res&m=request_url_for_json", {
			"method": "POST",
			"body": "file_id=" + file_id + "&type=VIEW&clazz_course_id=" + clazz_course_id,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then(result => result.json())
			.then(result => fetch(result.src))
			.then(result => result.text())
			.then(result => {
				let duration = 0;
				for(let each of Array.from(/^#EXTINF:(.*),$/gm[Symbol.matchAll](result))){
					duration += Number(each[1]);
				}
				return {
					"file_id": file_id,
					"clazz_course_id": clazz_course_id,
					"duration": duration
				}
			});
	}

	function addFinishElement(element){
		let button = document.createElement("button");
		button.textContent = "Finish it";
		button.type = "button";
		button.addEventListener("click", e => {
			e.preventDefault();
			e.stopPropagation();
			getVideoInfo(element).then(videoInfo => {
				return fetch("https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to", {
					"method": "POST",
					"body": "clazz_course_id=" + videoInfo["clazz_course_id"] +
						"&res_id=" + videoInfo["file_id"] +
						"&watch_to=" + videoInfo["duration"] +
						"&duration=" + videoInfo["duration"] +
						"&current_watch_to=0",
					"headers": {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				});
			}).then(result => {
				alert("Finish!");
			});
		});
		element.appendChild(button);
	}

	queryUnfinishedItems().forEach(element => {
		addFinishElement(element);
	});

})();

