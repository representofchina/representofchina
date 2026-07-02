const PROVINCES = ['天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省',
  '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省',
  '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区']

export default {
  setup() { return { PROVINCES } },
  template: `
  <footer class="footer">
    <div class="container links">
      <div class="grp"><b>全国人大</b>
        <a href="http://www.npc.gov.cn/" target="_blank">中国人大网</a></div>
      <div class="grp"><b>地方人大</b>
        <a href="https://www.bjrd.gov.cn/" target="_blank">北京市人大</a>
        <span v-for="p in PROVINCES" :key="p" style="color:#c98f96;margin-right:10px">{{ p }}</span>
      </div>
      <div class="grp"><b>友情链接</b>
        <a href="http://www.people.com.cn/" target="_blank">人民网</a>
        <a href="http://www.xinhuanet.com/" target="_blank">新华网</a>
      </div>
    </div>
    <div class="container copy">
      本站为公共信息聚合演示项目，数据来源于各级人大官网公开信息，并保留来源链接。<br>
      仅收录官网公开字段，不含非公开的个人隐私信息。
    </div>
  </footer>
  `,
}
