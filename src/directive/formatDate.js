
const formatDate = {};
formatDate.install = (Vue) => {
  Vue.directive('formatDate', {
    bind(el, binding) {
        var d = new Date(binding.value*1);
        var year = d.getFullYear();
        var months = d.getMonth() + 1;
        var month=months <10 ? '0' + months : '' + months;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
       el.innerHTML=year+ '-' + month + '-' + day ;
    }
  })
};

export default formatDate;

