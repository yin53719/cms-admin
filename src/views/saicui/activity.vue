 <template>
<div>
    <iframe :src='url' height="1024"  width="100%" id="myiframe" name="my" style="border:none;"></iframe>
</div>
</template>

 
<script>
  export default {
    name:"iframeiframe",
    data () {
      return {
        url:''
      }
    }, 
    mounted () {
      this.url=this.$route.query.href;
    },
    methods: {
       
    }
  }
</script>
 
<style>
body{margin:0; padding:0;}

</style>