 <template>
<div class="app-container calendar-list-container">
   <activity v-if="show=='activity'"> </activity>
  <activityadd v-if="show=='activityadd'"> </activityadd>
  <activityother v-if="show=='activityother'"> </activityother>
</div>
</template>

<script>
import activity from './components/activity'
import activityadd from './components/activityadd'
import activityother from './components/activityother'
export default {
  name: "user",
  components:{
    activity,
    activityadd,
    activityother
  },
  data() {
    return {
      show:'activity',
      activityUpdata:'',
      activityIdForDetail: '',
      activeName2:'',
    };
  },
  created() {
    
  },

  mounted(){
    // var ue = window.UE.getEditor('editor');
  },
  methods: {

  }
};
</script>
