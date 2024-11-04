// ==UserScript==
// @name	Unipus uexercise listen everything
// @version	2024-11-04
// @description	Listen everything
// @author	Turcking
// @match	https://uexercise.unipus.cn/uexercise/api/v1/enter_exercise_exam*
// ==/UserScript==

(function() {
	new MutationObserver((mutationList, observe) => mutationList.forEach(mutation => {
		if(mutation.target.classList.contains("active") || mutation.target.classList.contains("disabled-active"))
			mutation.target.classList.remove("active", "disabled-active");
	})).observe(document.querySelector("#all-content"), {
		"subtree": true,
		"attributeFilter": ["class"]
	});
})();

