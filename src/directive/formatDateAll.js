
const formatDateAll = {};
formatDateAll.install = (Vue) => {
  Vue.directive('formatDateAll', {
    bind(el, binding) {
      if(binding.value == null || binding.value == ''){
        el.innerHTML = binding.value;
        return false;
      }
        var d = new Date(binding.value*1);
        var year = d.getFullYear();
        var months = d.getMonth() + 1;
        var month=months <10 ? '0' + months : '' + months;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        var hh=d.getHours()
        var mm=d.getMinutes()
        let ss=d.getSeconds()
       el.innerHTML=year+ '-' + month + '-' + day +' ' + hh +':' + mm +':' + ss;
    }
  })
};

export default formatDateAll;

//用户 v-format-date-all="1111"

