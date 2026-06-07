const accounts=[
 {u:'admin',password:'123456',name:'Admin',rank:'',pos:'',phone:'',status:'Hoạt động',role:'Quản trị viên'},
 {u:'nguyenvana',password:'123456',name:'Nguyễn Văn A',rank:'Đại úy',pos:'Cán bộ',phone:'0912345678',status:'Hoạt động',role:'Cán bộ nghiệp vụ'},
 {u:'tranthib',password:'123456',name:'Trần Thị B',rank:'Thượng úy',pos:'Đội trưởng',phone:'0987654321',status:'Hoạt động',role:'Đội trưởng'},
 {u:'levanc',password:'123456',name:'Lê Văn C',rank:'Trung úy',pos:'Phó đội trưởng',phone:'0901122334',status:'Tạm khóa',role:'Cán bộ nghiệp vụ'}
];
const perms=['Quản lý hệ thống','Quản lý hồ sơ cán bộ','Quản lý tài sản','Quản lý phân quyền phần mềm','Báo cáo thống kê','Xuất dữ liệu'];
const accountPerms={
 admin:perms,
 nguyenvana:['Quản lý hồ sơ cán bộ','Quản lý tài sản','Xuất dữ liệu'],
 tranthib:['Quản lý hồ sơ cán bộ','Quản lý tài sản','Báo cáo thống kê'],
 levanc:['Quản lý tài sản']
};
const assets=[
 {id:'TB001',name:'Máy tính để bàn HP EliteDesk',type:'PC',date:'14/05/2026',owner:'Nguyễn Văn A',unit:'Đội trang bị',status:'Đang sử dụng',value:'18000000',note:'Máy làm việc văn phòng'},
 {id:'TB002',name:'Xe ô tô Ford Everest',type:'Ô tô',date:'22/04/2026',owner:'Trần Thị B',unit:'Phòng CNTT',status:'Đang sử dụng',value:'980000000',note:'Xe công tác'},
 {id:'TB003',name:'Máy chiếu Sony',type:'Máy chiếu',date:'09/03/2026',owner:'Phòng tổng hợp',unit:'Phòng tổng hợp',status:'Bảo trì',value:'24000000',note:'Chờ bảo trì'},
 {id:'TB004',name:'Màn hình Dell 24 inch',type:'Màn hình',date:'10/05/2026',owner:'Nguyễn Văn A',unit:'Đội trang bị',status:'Đang sử dụng',value:'4200000',note:'Màn hình làm việc'},
 {id:'TB005',name:'Bàn phím Logitech K120',type:'Bàn phím',date:'10/05/2026',owner:'Nguyễn Văn A',unit:'Đội trang bị',status:'Đang sử dụng',value:'250000',note:'Thiết bị ngoại vi'},
 {id:'TB006',name:'Chuột Logitech M90',type:'Chuột',date:'10/05/2026',owner:'Nguyễn Văn A',unit:'Đội trang bị',status:'Đang sử dụng',value:'180000',note:'Thiết bị ngoại vi'},
 {id:'TB007',name:'Xe máy Honda Wave',type:'Xe máy',date:'05/04/2026',owner:'Lê Văn C',unit:'Đội tổng hợp',status:'Đang sử dụng',value:'22000000',note:'Phương tiện cơ động'},
 {id:'TB008',name:'Flycam DJI Mini',type:'Flycam',date:'18/04/2026',owner:'Trần Thị B',unit:'Phòng CNTT',status:'Đang sử dụng',value:'15000000',note:'Thiết bị hỗ trợ quan sát'},
 {id:'TB009',name:'Điện thoại Samsung A55',type:'Di động',date:'19/04/2026',owner:'Trần Thị B',unit:'Phòng CNTT',status:'Hư',value:'8500000',note:'Vỡ màn hình'}
];
const assetCategories=['PC','Màn hình','Bàn phím','Chuột','Xe máy','Flycam','Di động','Ô tô','Máy chiếu'];
const teams=[
 {name:'Đội trang bị',staff:['Nguyễn Văn A','Trần Thị B']},
 {name:'Đội tổng hợp',staff:['Lê Văn C']},
 {name:'Trạm tổng hợp',staff:[]}
];
const staffTabs={
 'Thông tin cá nhân':['Họ và tên','Ngày sinh','Giới tính','Dân tộc','Số CCCD','Ngày cấp CCCD','Nơi thường trú','Nơi ở hiện nay'],
 'Thông tin công tác':['Đơn vị công tác','Chức vụ hiện tại','Cấp bậc','Ngày vào ngành','Chuyên ngành đào tạo','Trình độ chuyên môn'],
 'Trình độ đào tạo':['Trình độ học vấn','Trường đào tạo','Chuyên ngành','Năm tốt nghiệp','Loại hình đào tạo','Ngoại ngữ'],
 'Thông tin khác':['Tình trạng hôn nhân','Số điện thoại','Email','Ghi chú'],
 'Tài liệu số hóa':['Tên tài liệu','Loại tài liệu','Ngày tải lên','Mô tả']
};
const staffData={
 'Thông tin cá nhân':{'Họ và tên':'Nguyễn Văn A','Ngày sinh':'12/03/1992','Giới tính':'Nam','Dân tộc':'Kinh','Số CCCD':'001092000001','Ngày cấp CCCD':'20/04/2021','Nơi thường trú':'Hà Nội','Nơi ở hiện nay':'Hà Nội'},
 'Thông tin công tác':{'Đơn vị công tác':'Đội trang bị','Chức vụ hiện tại':'Cán bộ','Cấp bậc':'Đại úy','Ngày vào ngành':'15/08/2014','Chuyên ngành đào tạo':'Công nghệ thông tin','Trình độ chuyên môn':'Đại học'},
 'Trình độ đào tạo':{},
 'Thông tin khác':{'Số điện thoại':'0912345678','Email':'nguyenvana@example.local'},
 'Tài liệu số hóa':{}
};
const staffProfiles=[
 {username:'nguyenvana',photo:'',sections:{
  'Thông tin cá nhân':{'Họ và tên':'Nguyễn Văn A','Ngày sinh':'12/03/1992','Giới tính':'Nam','Dân tộc':'Kinh','Số CCCD':'001092000001','Ngày cấp CCCD':'20/04/2021','Nơi thường trú':'Hà Nội','Nơi ở hiện nay':'Hà Nội'},
  'Thông tin công tác':{'Đơn vị công tác':'Đội trang bị','Chức vụ hiện tại':'Cán bộ','Cấp bậc':'Đại úy','Ngày vào ngành':'15/08/2014','Chuyên ngành đào tạo':'Công nghệ thông tin','Trình độ chuyên môn':'Đại học'},
  'Trình độ đào tạo':{'Trình độ học vấn':'Đại học','Trường đào tạo':'Học viện Kỹ thuật mật mã','Chuyên ngành':'Công nghệ thông tin','Năm tốt nghiệp':'2014','Loại hình đào tạo':'Chính quy','Ngoại ngữ':'Tiếng Anh B1'},
  'Thông tin khác':{'Tình trạng hôn nhân':'Đã kết hôn','Số điện thoại':'0912345678','Email':'nguyenvana@example.local','Ghi chú':'Cán bộ phụ trách thiết bị CNTT'},
  'Tài liệu số hóa':{'Tên tài liệu':'Hồ sơ cán bộ','Loại tài liệu':'PDF scan','Ngày tải lên':'01/06/2026','Mô tả':'Hồ sơ lý lịch và văn bằng'}
 }},
 {username:'tranthib',photo:'',sections:{
  'Thông tin cá nhân':{'Họ và tên':'Trần Thị B','Ngày sinh':'08/11/1990','Giới tính':'Nữ','Dân tộc':'Kinh','Số CCCD':'001090000002','Ngày cấp CCCD':'12/05/2020','Nơi thường trú':'TP Hồ Chí Minh','Nơi ở hiện nay':'TP Hồ Chí Minh'},
  'Thông tin công tác':{'Đơn vị công tác':'Phòng CNTT','Chức vụ hiện tại':'Đội trưởng','Cấp bậc':'Thượng úy','Ngày vào ngành':'03/09/2012','Chuyên ngành đào tạo':'Quản trị hệ thống','Trình độ chuyên môn':'Đại học'},
  'Trình độ đào tạo':{'Trình độ học vấn':'Đại học','Trường đào tạo':'Đại học An ninh nhân dân','Chuyên ngành':'An toàn thông tin','Năm tốt nghiệp':'2012','Loại hình đào tạo':'Chính quy','Ngoại ngữ':'Tiếng Anh B2'},
  'Thông tin khác':{'Tình trạng hôn nhân':'Độc thân','Số điện thoại':'0987654321','Email':'tranthib@example.local','Ghi chú':'Phụ trách điều phối đội'},
  'Tài liệu số hóa':{'Tên tài liệu':'Quyết định bổ nhiệm','Loại tài liệu':'PDF scan','Ngày tải lên':'20/05/2026','Mô tả':'Quyết định chức vụ đội trưởng'}
 }},
 {username:'levanc',photo:'',sections:{
  'Thông tin cá nhân':{'Họ và tên':'Lê Văn C','Ngày sinh':'17/07/1995','Giới tính':'Nam','Dân tộc':'Kinh','Số CCCD':'001095000003','Ngày cấp CCCD':'06/06/2022','Nơi thường trú':'Đà Nẵng','Nơi ở hiện nay':'Đà Nẵng'},
  'Thông tin công tác':{'Đơn vị công tác':'Đội tổng hợp','Chức vụ hiện tại':'Phó đội trưởng','Cấp bậc':'Trung úy','Ngày vào ngành':'10/10/2018','Chuyên ngành đào tạo':'Hành chính','Trình độ chuyên môn':'Đại học'},
  'Trình độ đào tạo':{'Trình độ học vấn':'Đại học','Trường đào tạo':'Học viện Cảnh sát nhân dân','Chuyên ngành':'Quản lý hành chính','Năm tốt nghiệp':'2018','Loại hình đào tạo':'Chính quy','Ngoại ngữ':'Tiếng Anh B1'},
  'Thông tin khác':{'Tình trạng hôn nhân':'Đã kết hôn','Số điện thoại':'0901122334','Email':'levanc@example.local','Ghi chú':'Tài khoản đang tạm khóa'},
  'Tài liệu số hóa':{'Tên tài liệu':'Hồ sơ công tác','Loại tài liệu':'PDF scan','Ngày tải lên':'18/05/2026','Mô tả':'Hồ sơ cập nhật năm 2026'}
 }}
];
const defaultModuleDefinitions=[
 {key:'permissions',name:'Hệ thống & Phân quyền',description:'Quản trị tài khoản, nhóm người dùng và quyền chức năng',icon:'shield-check',visible:true,isAdminOnly:true,custom:false},
 {key:'staffDirectory',name:'Quản lý cán bộ',description:'Quản lý cán bộ theo đội, xem số hiệu, số điện thoại và hồ sơ chi tiết',icon:'users-round',visible:true,isAdminOnly:true,custom:false},
 {key:'catalogManager',name:'Quản lý danh mục',description:'Thêm, sửa, xóa chức vụ và chức hàm',icon:'list-plus',visible:true,isAdminOnly:true,custom:false},
 {key:'teamManager',name:'Quản lý đơn vị',description:'Tạo cấp phòng, cấp xã và quản lý các đội trực thuộc',icon:'building-2',visible:true,isAdminOnly:true,custom:false},
 {key:'moduleManager',name:'Quản lý module',description:'Thiết lập module được hiển thị cho tài khoản cán bộ',icon:'layout-dashboard',visible:true,isAdminOnly:true,custom:false},
 {key:'assetCategoryManager',name:'Danh mục tài sản',description:'Quản lý loại tài sản và theo dõi trạng thái thiết bị',icon:'boxes',visible:true,isAdminOnly:true,custom:false},
 {key:'reports',name:'Báo cáo',description:'Thống kê thiết bị và tình hình bàn giao theo đội',icon:'chart-column',visible:true,isAdminOnly:true,custom:false},
 {key:'activityLog',name:'Log lịch sử',description:'Theo dõi toàn bộ quá trình sử dụng và thay đổi dữ liệu của tài khoản',icon:'history',visible:true,isAdminOnly:true,custom:false},
 {key:'assets',name:'Quản lý Tài sản',description:'Cho phép xem tài sản được bàn giao',icon:'package-check',visible:true,isAdminOnly:false,custom:false},
 {key:'settings',name:'Cài đặt',description:'Tùy biến chế độ hiển thị, màu nhấn và mật độ giao diện',icon:'settings',visible:true,isAdminOnly:false,custom:false}
];
const moduleDefinitions=defaultModuleDefinitions.map(module=>({...module}));
const moduleVisibility=Object.fromEntries(defaultModuleDefinitions.map(module=>[module.key,module.visible!==false]));
const permissionModuleMap={
 'Quản lý hồ sơ cán bộ':'staff',
 'Quản lý tài sản':'assets'
};
const accountImportColumns=['Tên đăng nhập','Mật khẩu','Họ tên','Số điện thoại','Cấp bậc','Chức vụ','Loại đơn vị','Đơn vị','Đội/Trạm','Trạng thái'];
const assetImportColumns=['Mã tài sản','Tên tài sản','Chủng loại','Hiện trạng','Nguyên giá','Ngày nhận','Đơn vị quản lý','Người quản lý','Ghi chú'];
const catalogs={
 positions:['Cán bộ','Đội trưởng','Phó đội trưởng'],
 ranks:['Thiếu úy','Trung úy','Đại úy','Thượng úy']
};
const assetTabs=['Thu hồi/Tiếp nhận','Danh sách tài sản','Lập mới tài sản','Kiểm kê'];
const assetPanels=['assetReceive','assetList','assetAdd','assetCheck'];
const sessionUserKey='ttttchCurrentUser';
let currentUser=null;
let selectedRole='admin';
let permissionsDirty=false;
let selectedStaff='';
let editingUser=null;
let editingAsset=null;
let activeStaffTab=Object.keys(staffTabs)[0];
let staffAvatarSrc='';
let selectedTeam='Đội trang bị';
let selectedStaffTeam='Đội trang bị';
let selectedAssetCategory='PC';
let selectedAssetStatus='all';
let departmentCatalog=[
 {id:1,name:'Phòng PV01',unit_type:'Cấp phòng',team_count:2,staff_count:3,asset_count:assets.length},
 {id:2,name:'Công an xã mẫu',unit_type:'Cấp xã',team_count:1,staff_count:0,asset_count:0}
];
let teamCatalog=[
 {id:1,name:'Đội trang bị',department_id:1,department:'Phòng PV01',unit_type:'Cấp phòng',staff_count:2,asset_count:assets.filter(asset=>asset.unit==='Đội trang bị').length},
 {id:2,name:'Đội tổng hợp',department_id:1,department:'Phòng PV01',unit_type:'Cấp phòng',staff_count:1,asset_count:assets.filter(asset=>asset.unit==='Đội tổng hợp').length},
 {id:3,name:'Trạm tổng hợp',department_id:2,department:'Công an xã mẫu',unit_type:'Cấp xã',staff_count:0,asset_count:0}
];
const appearanceDefaults={theme:'light',accent:'crimson',density:'comfortable',motion:true};
let appearanceSettings={...appearanceDefaults};
const dateFields=new Set(['Ngày sinh','Ngày cấp CCCD','Ngày vào ngành','Ngày tải lên','Ngày nhận']);
const genderOptions=['Nam','Nữ'];
const maritalOptions=['Độc thân','Đã kết hôn'];
const assetStatusOptions=['Đang sử dụng','Bảo trì','Hư','Tạm dừng'];
const inventorySessions=[];
const inventoryItemsBySession={};
let selectedInventoryId=null;
let inventoryLoading=false;
const activityLogs=[];
let activityLogLoading=false;
let lastLoggedPage='';

function $(s){return document.querySelector(s)}
function $all(s){return [...document.querySelectorAll(s)]}
function toast(msg='Đã lưu thành công'){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function escapeHtml(value){return String(value ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toDateInputValue(value){
 if(!value)return '';
 const text=String(value);
 const vn=text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
 if(vn)return `${vn[3]}-${vn[2]}-${vn[1]}`;
 const iso=text.match(/^(\d{4})-(\d{2})-(\d{2})/);
 if(iso)return `${iso[1]}-${iso[2]}-${iso[3]}`;
 const date=new Date(text);
 if(Number.isNaN(date.getTime()))return '';
 return date.toISOString().slice(0,10);
}
function fromDateInputValue(value){
 if(!value)return '';
 const match=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
 return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
function renderSelectOptions(options,value,placeholder='Chọn'){
 return `<option value="">${placeholder}</option>`+options.map(option=>`<option value="${escapeHtml(option)}" ${option===value?'selected':''}>${escapeHtml(option)}</option>`).join('');
}
function getOfficerAccountNames(){
 const names=accounts.filter(account=>account.u!=='admin' && account.name).map(account=>account.name);
 return [...new Set(names)];
}
function renderOfficerOptions(value=''){
 const names=getOfficerAccountNames();
 const options=value && !names.includes(value) ? [value,...names] : names;
 return renderSelectOptions(options,value,'Chọn cán bộ quản lý');
}
function updateBulkDeleteButton(buttonSelector, checkboxSelector){
 const button=$(buttonSelector);
 if(!button)return;
 const hasSelection=$all(checkboxSelector).some(input=>input.checked);
 button.classList.toggle('hidden',!hasSelection);
}
function bindBulkSelection(buttonSelector, checkboxSelector){
 $all(checkboxSelector).forEach(input=>input.onchange=()=>updateBulkDeleteButton(buttonSelector,checkboxSelector));
 updateBulkDeleteButton(buttonSelector,checkboxSelector);
}
function refreshIcons(){if(window.lucide)window.lucide.createIcons()}
function normalizeUnitText(unitType){
 return unitType==='Cấp xã'?'Cấp xã':'Cấp phòng';
}
function getAssignmentName(unitType){
 return normalizeUnitText(unitType)==='Cấp xã'?'trạm':'đội';
}
function recalculateOrgStats(){
 teamCatalog.forEach(team=>{
  const teamName=team.name;
  const staffFromAccounts=accounts.filter(account=>account.u!=='admin' && account.team===teamName).length;
  const legacyTeam=teams.find(item=>item.name===teamName);
  team.staff_count=staffFromAccounts || legacyTeam?.staff?.length || 0;
  team.asset_count=assets.filter(asset=>asset.unit===teamName).length;
 });
 departmentCatalog.forEach(department=>{
  const relatedTeams=teamCatalog.filter(team=>String(team.department_id||'')===String(department.id));
  department.team_count=relatedTeams.length;
  department.staff_count=relatedTeams.reduce((sum,team)=>sum+(team.staff_count||0),0);
  department.asset_count=relatedTeams.reduce((sum,team)=>sum+(team.asset_count||0),0);
 });
}
function saveLocalOrgData(){
 if(location.protocol!=='file:')return;
 localStorage.setItem('ttttchOrgData',JSON.stringify({departments:departmentCatalog,teams:teamCatalog}));
}
function loadLocalOrgData(){
 if(location.protocol!=='file:')return;
 try{
  const stored=JSON.parse(localStorage.getItem('ttttchOrgData')||'{}');
  if(Array.isArray(stored.departments) && Array.isArray(stored.teams)){
   departmentCatalog.splice(0,departmentCatalog.length,...stored.departments);
   teamCatalog.splice(0,teamCatalog.length,...stored.teams);
   recalculateOrgStats();
  }
 }catch(error){
  console.warn('Không đọc được dữ liệu đơn vị localStorage',error);
 }
}
function loadAppearanceSettings(){
 try{
  const stored=JSON.parse(localStorage.getItem('ttttchAppearance')||'{}');
  appearanceSettings={...appearanceDefaults,...stored};
 }catch(error){
  appearanceSettings={...appearanceDefaults};
 }
 applyAppearanceSettings();
}
function saveAppearanceSettings(){
 localStorage.setItem('ttttchAppearance',JSON.stringify(appearanceSettings));
 applyAppearanceSettings();
 renderSettings();
}
function applyAppearanceSettings(){
 const resolvedTheme=appearanceSettings.theme==='system'
  ? (window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
  : appearanceSettings.theme;
 document.body.classList.toggle('theme-dark',resolvedTheme==='dark');
 document.body.classList.toggle('theme-light',resolvedTheme!=='dark');
 document.body.classList.remove('accent-crimson','accent-gold','accent-emerald','density-compact','density-comfortable','motion-reduced');
 document.body.classList.add(`accent-${appearanceSettings.accent}`,`density-${appearanceSettings.density}`);
 if(!appearanceSettings.motion)document.body.classList.add('motion-reduced');
}
function getInitials(name){return String(name||'CB').split(' ').filter(Boolean).slice(-2).map(w=>w[0]).join('').toUpperCase()}
function renderHeaderMeta(){
 const date=new Date();
 $('#currentDateLabel').textContent=date.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
 if(currentUser)$('#userAvatar').textContent=getInitials(currentUser.name).slice(0,2);
 refreshIcons();
}
function slugify(value){
 return String(value||'module').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'module';
}
function normalizeModuleDefinition(module){
 const key=module.module_key || module.key;
 return {
  key,
  name:module.name || key,
  description:module.description || '',
  icon:module.icon || 'blocks',
  custom:Boolean(module.is_custom ?? module.custom),
  isAdminOnly:Boolean(module.is_admin_only ?? module.isAdminOnly),
  visible:module.visible !== false
 };
}
function rebuildModuleDefinitions(apiModules=[]){
 const apiByKey=new Map(apiModules.map(module=>normalizeModuleDefinition(module)).filter(module=>module.key).map(module=>[module.key,module]));
 const merged=defaultModuleDefinitions.map(defaultModule=>{
  const apiModule=apiByKey.get(defaultModule.key);
  apiByKey.delete(defaultModule.key);
  return {...defaultModule,...apiModule,key:defaultModule.key};
 });
 apiByKey.forEach(module=>merged.push(module));
 moduleDefinitions.splice(0,moduleDefinitions.length,...merged);
 Object.keys(moduleVisibility).forEach(key=>delete moduleVisibility[key]);
 merged.forEach(module=>{moduleVisibility[module.key]=module.visible!==false});
}
function getStaffProfile(username){
 let profile=staffProfiles.find(p=>p.username===username);
 const account=accounts.find(a=>a.u===username);
 if(!profile && account && account.u!=='admin'){
  profile={username,photo:'',sections:{
   'Thông tin cá nhân':{'Họ và tên':account.name,'Số điện thoại':account.phone},
   'Thông tin công tác':{'Đơn vị công tác':account.team,'Chức vụ hiện tại':account.pos,'Cấp bậc':account.rank},
   'Trình độ đào tạo':{},
   'Thông tin khác':{},
   'Tài liệu số hóa':{}
  }};
  staffProfiles.push(profile);
 }
 return profile;
}

function renderLogin(){
 const input=$('#loginAccount');
 if(input)input.placeholder='VD: admin';
}
function sanitizeUsernameInput(value){
 return String(value||'').trim().toLowerCase().replace(/\s+/g,'');
}
function isValidUsername(value){
 return /^[a-z0-9._-]{3,32}$/.test(String(value||''));
}
function getUsernameError(value){
 if(!value)return 'Vui lòng nhập tên đăng nhập';
 if(!isValidUsername(value))return 'Tên đăng nhập chỉ dùng chữ thường không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang, dài 3-32 ký tự';
 return '';
}
function readWindowSession(){
 try{
  const data=JSON.parse(window.name||'{}');
  return data?.ttttchCurrentUser||'';
 }catch(_error){
  return '';
 }
}
function writeWindowSession(username=''){
 try{
  const data=JSON.parse(window.name||'{}');
  if(username)data.ttttchCurrentUser=username;
  else delete data.ttttchCurrentUser;
  window.name=Object.keys(data).length?JSON.stringify(data):'';
 }catch(_error){
  window.name=username?JSON.stringify({ttttchCurrentUser:username}):'';
 }
}
function readHashSession(){
 try{
  const params=new URLSearchParams(String(location.hash||'').replace(/^#/,''));
  return params.get(sessionUserKey)||'';
 }catch(_error){
  return '';
 }
}
function writeHashSession(username=''){
 try{
  const url=new URL(location.href);
  if(username){
   const params=new URLSearchParams(String(url.hash||'').replace(/^#/,''));
   params.set(sessionUserKey,username);
   url.hash=params.toString();
  }else{
   const params=new URLSearchParams(String(url.hash||'').replace(/^#/,''));
   params.delete(sessionUserKey);
   url.hash=params.toString();
  }
  history.replaceState(null,'',url.href);
 }catch(_error){}
}
function readStoredSession(){
 try{
  return localStorage.getItem(sessionUserKey) || sessionStorage.getItem(sessionUserKey) || readWindowSession() || readHashSession();
 }catch(_error){
  return readWindowSession() || readHashSession();
 }
}
function setLoginSession(username){
 if(!username)return;
 try{localStorage.setItem(sessionUserKey,username)}catch(_error){}
 try{sessionStorage.setItem(sessionUserKey,username)}catch(_error){}
 writeWindowSession(username);
 writeHashSession(username);
}
function clearLoginSession(){
 try{localStorage.removeItem(sessionUserKey)}catch(_error){}
 try{sessionStorage.removeItem(sessionUserKey)}catch(_error){}
 writeWindowSession('');
 writeHashSession('');
}
function activateUserSession(account,{restore=false}={}){
 currentUser=account;
 setLoginSession(account.u);
 $('#loginScreen').classList.add('hidden');
 $('#appShell').classList.remove('locked');
 $('#currentUser').textContent=account.name;
 $('#currentRole').textContent=account.role;
 renderHeaderMeta();
 loadStaffDataForCurrentUser();
 updateAdminVisibility();
 updateModuleVisibility();
 showPage(account.u==='admin'?'permissions':getFirstUserPage());
 if(!restore)recordActivity('Đăng nhập','login','Đăng nhập hệ thống');
}
function restoreLoginSession(){
 const username=readStoredSession();
 if(!username)return false;
 const account=accounts.find(a=>a.u===username);
 if(!account || account.status!=='Hoạt động'){
  clearLoginSession();
  return false;
 }
 activateUserSession(account,{restore:true});
 return true;
}
function login(event){
 event.preventDefault();
 const username=sanitizeUsernameInput($('#loginAccount').value);
 $('#loginAccount').value=username;
 const account=accounts.find(a=>a.u.toLowerCase()===username);
 if(!account || account.password!==$('#loginPassword').value){toast('Sai tài khoản hoặc mật khẩu');return}
 if(account.status!=='Hoạt động'){toast('Tài khoản đang bị tạm khóa');return}
 activateUserSession(account);
 toast('Đăng nhập thành công');
}
function logout(){
 const user=currentUser;
 if(user)recordActivity('Đăng xuất','login','Đăng xuất hệ thống',{username:user.u});
 currentUser=null;
 clearLoginSession();
 $('#appShell').classList.add('locked');
 $('#loginScreen').classList.remove('hidden');
}
function togglePassword(){
 const input=$('#loginPassword');
 const button=$('#togglePassword');
 const visible=input.type==='text';
 input.type=visible?'password':'text';
 button.textContent=visible?'Hiện':'Ẩn';
 button.setAttribute('aria-label',visible?'Hiển thị mật khẩu':'Ẩn mật khẩu');
}
function toggleUserPassword(){
 const input=$('#newUserForm').password;
 const button=$('#toggleUserPassword');
 const visible=input.type==='text';
 input.type=visible?'password':'text';
 button.textContent=visible?'Hiện':'Ẩn';
 button.setAttribute('aria-label',visible?'Hiển thị mật khẩu tài khoản':'Ẩn mật khẩu tài khoản');
}

function renderAccounts(){
 const q=$('#accountSearch').value.toLowerCase(), f=$('#statusFilter').value;
 $('#totalAccounts').textContent=accounts.length;
 $('#activeAccounts').textContent=accounts.filter(a=>a.status==='Hoạt động').length;
 $('#lockedAccounts').textContent=accounts.filter(a=>a.status==='Tạm khóa').length;
 $('#totalPerms').textContent=perms.length;
 $('#accountRows').innerHTML=accounts.filter(a=>(!f||a.status==f)&&JSON.stringify(a).toLowerCase().includes(q)).map(a=>`
 <tr>
  <td>${a.u==='admin'?'':`<input type="checkbox" data-select-account="${escapeHtml(a.u)}" aria-label="Chọn tài khoản ${escapeHtml(a.u)}"/>`}</td>
  <td>${escapeHtml(a.u)}</td><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.rank)}</td><td>${escapeHtml(a.pos)}</td><td>${escapeHtml(a.phone)}</td>
  <td><span class="badge ${a.status==='Hoạt động'?'ok':'lock'}">${escapeHtml(a.status)}</span></td>
  <td><div class="table-actions"><button class="link-btn icon-button" data-edit-user="${a.u}"><i data-lucide="square-pen"></i>Sửa</button>${a.u==='admin'?'':`<button class="link-btn icon-button" data-toggle-user="${a.u}"><i data-lucide="${a.status==='Hoạt động'?'lock':'unlock'}"></i>${a.status==='Hoạt động'?'Khóa':'Mở khóa'}</button>`}</div></td>
 </tr>`).join('');
 $all('[data-edit-user]').forEach(b=>b.onclick=()=>openUserModal(b.dataset.editUser));
 $all('[data-toggle-user]').forEach(b=>b.onclick=()=>toggleUserStatus(b.dataset.toggleUser));
 const selectAll=$('#selectAllAccounts');
 if(selectAll){
  selectAll.checked=false;
  selectAll.onchange=()=>{
   $all('[data-select-account]').forEach(input=>input.checked=selectAll.checked);
   updateBulkDeleteButton('#deleteSelectedAccounts','[data-select-account]');
  };
 }
 bindBulkSelection('#deleteSelectedAccounts','[data-select-account]');
 refreshIcons();
}
function updateAdminVisibility(){
 const isAdmin=currentUser?.u==='admin';
 $all('.admin-only').forEach(el=>{
  if(el.dataset.moduleKey)return;
  el.classList.toggle('hidden',!isAdmin);
 });
}
function updateModuleVisibility(){
 renderDynamicModuleShells();
 const isAdmin=currentUser?.u==='admin';
 $all('[data-module-key]').forEach(el=>{
  const key=el.dataset.moduleKey;
  const shouldShow=isAdmin ? key!=='staff' : canAccessModule(key);
  el.classList.toggle('hidden',!shouldShow);
 });
}
function canAccessModule(key, username=currentUser?.u){
 if(!username)return false;
 if(key==='activityLog')return username==='admin';
 if(key==='settings')return moduleVisibility.settings!==false;
 if(username==='admin')return key!=='staff';
 const userPerms=accountPerms[username]||[];
 if(moduleVisibility[key] && (userPerms.includes('Quản lý hệ thống') || userPerms.includes('Quản lý phân quyền phần mềm')))return true;
 const requiredPerm=Object.keys(permissionModuleMap).find(perm=>permissionModuleMap[perm]===key);
 return Boolean(moduleVisibility[key] && requiredPerm && userPerms.includes(requiredPerm));
}
function isAdminUser(){return currentUser?.u==='admin'}
function getFirstUserPage(){
 const first=moduleDefinitions.find(m=>canAccessModule(m.key));
 return first ? first.key : 'noAccess';
}
function showPage(page){
 const canOpenStaffEditor=currentUser?.u!=='admin' && page==='staff' && (canAccessModule('staff') || canAccessModule('staffDirectory'));
 if(currentUser?.u!=='admin' && page!=='noAccess' && !canAccessModule(page) && !canOpenStaffEditor)page=getFirstUserPage();
 if(currentUser?.u==='admin' && page==='staff')page='staffDirectory';
 if(page==='moduleManager')renderModuleSettings();
 const targetButton=$(`.nav-item[data-page="${page}"]`);
 $all('.nav-item').forEach(b=>b.classList.remove('active'));
 if(targetButton)targetButton.classList.add('active');
 $all('.page').forEach(p=>p.classList.remove('active'));
 const pageEl=$('#'+page);
 pageEl.classList.add('active');
 if(canOpenStaffEditor && page==='staff')pageEl.classList.remove('hidden');
 const titles={
  permissions:['Hệ thống & Phân quyền','Quản trị tài khoản, nhóm người dùng và quyền chức năng'],
  staff:['Hồ sơ Cán bộ','Nhập liệu, cập nhật và số hóa thông tin cán bộ'],
  staffDirectory:['Quản lý cán bộ','Quản lý cán bộ theo đội, xem số hiệu, số điện thoại và hồ sơ chi tiết'],
  moduleManager:['Quản lý module','Thiết lập module được hiển thị cho tài khoản cán bộ'],
  teamManager:['Quản lý đơn vị','Tạo cấp phòng, cấp xã và quản lý các đội trực thuộc'],
  catalogManager:['Quản lý danh mục','Thêm, sửa, xóa chức vụ và chức hàm'],
  assetCategoryManager:['Danh mục tài sản','Quản lý loại tài sản và theo dõi trạng thái thiết bị'],
  reports:['Báo cáo','Thống kê thiết bị và tình hình bàn giao theo đội'],
  activityLog:['Log lịch sử','Theo dõi toàn bộ quá trình sử dụng và thay đổi dữ liệu của tài khoản'],
  settings:['Cài đặt','Tùy biến giao diện, chế độ màu và trải nghiệm sử dụng'],
  noAccess:['Không có quyền truy cập','Tài khoản chưa được phân quyền sử dụng module'],
  assets:['Quản lý Tài sản','Tiếp nhận, phân bổ, kiểm kê và theo dõi tài sản']
 };
 const dynamicModule=moduleDefinitions.find(module=>module.key===page);
 let title=(titles[page]?.[0]) || dynamicModule?.name || 'Module';
 let subtitle=(titles[page]?.[1]) || dynamicModule?.description || 'Module tùy chỉnh';
 if(!isAdminUser() && page==='staffDirectory')subtitle='Chỉ hiển thị hồ sơ cá nhân của tài khoản đang đăng nhập';
 if(!isAdminUser() && page==='assetCategoryManager')subtitle='Chỉ hiển thị danh mục và tài sản đã bàn giao cho tài khoản đang đăng nhập';
 $('#pageTitle').textContent=title;
 $('#pageSubtitle').textContent=subtitle;
 if(page==='assets')renderAssets();
 if(page==='staffDirectory')renderStaffDirectory();
 if(page==='catalogManager')renderCatalogs();
 if(page==='reports')renderReports();
 if(page==='activityLog')renderActivityLogs();
 if(page==='assetCategoryManager')renderAssetCategories();
 if(page==='teamManager')renderTeamManager();
 if(page==='settings')renderSettings();
 if(currentUser && page!=='noAccess' && lastLoggedPage!==page){
  lastLoggedPage=page;
  recordActivity('Mở module',page,`Mở module ${title}`);
 }
}
async function toggleUserStatus(username){
 if(username==='admin'){toast('Không thể khóa tài khoản Admin');return}
 const user=accounts.find(a=>a.u===username);
 if(!user)return;
 const nextStatus=user.status==='Hoạt động'?'Tạm khóa':'Hoạt động';
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/accounts/${encodeURIComponent(username)}`,'PUT',{
    username:user.u,
    password:user.password,
    fullname:user.name,
    phone:user.phone,
    rank:user.rank,
    position:user.pos,
    status:nextStatus
   });
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không cập nhật được trạng thái');
   return;
  }
 }else{
  user.status=nextStatus;
 }
 renderAccounts();
 renderRoles();
 renderLogin();
 renderStaffDirectory();
 toast('Đã cập nhật trạng thái tài khoản');
}
async function deleteSelectedAccounts(){
 if(!isAdminUser()){toast('Chỉ Admin được xóa dữ liệu');return}
 const usernames=$all('[data-select-account]:checked').map(input=>input.dataset.selectAccount).filter(username=>username && username!=='admin');
 if(!usernames.length){toast('Chưa chọn tài khoản cần xóa');return}
 if(!confirm(`Xóa ${usernames.length} tài khoản đã chọn?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/accounts','DELETE',{usernames});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được tài khoản');
   return;
  }
 }else{
  usernames.forEach(username=>{
   const index=accounts.findIndex(account=>account.u===username);
   if(index>=0)accounts.splice(index,1);
   delete accountPerms[username];
  });
 }
 if(usernames.includes(selectedRole))selectedRole=accounts[0]?.u||'admin';
 if(usernames.includes(selectedStaff))selectedStaff=accounts.find(account=>account.u!=='admin')?.u||'';
 renderApp();
 toast('Đã xóa tài khoản đã chọn');
}
function openUserModal(username=null){
 editingUser=username;
 $('#newUserForm').reset();
 renderUserCatalogOptions();
 $('#newUserForm').password.type='password';
 $('#toggleUserPassword').textContent='Hiện';
 $('#userModalTitle').textContent=username?'Chỉnh sửa tài khoản':'Thêm mới tài khoản';
 const form=$('#newUserForm');
 form.username.disabled=username==='admin' || !isAdminUser();
 form.status.disabled=username==='admin';
 form.phone.disabled=username==='admin';
 form.rank.disabled=username==='admin';
 form.position.disabled=username==='admin';
 form.unitType.disabled=username==='admin';
 form.departmentId.disabled=username==='admin';
 form.team.disabled=username==='admin';
 if(username){
  const user=accounts.find(a=>a.u===username);
  form.username.value=user.u;
  form.password.value=user.password;
  form.fullname.value=user.name;
  form.phone.value=user.phone;
  form.rank.value=user.rank;
  form.position.value=user.pos;
  form.team.value=user.team||'';
  renderUserCatalogOptions(user.team||'');
  form.status.value=user.status;
 }
 $('#userModal').classList.add('show');
}
function getDepartmentForTeam(teamName){
 const team=teamCatalog.find(item=>item.name===teamName);
 if(!team)return null;
 return departmentCatalog.find(department=>String(department.id)===String(team.department_id)) || {
  id:team.department_id,
  name:team.department||'',
  unit_type:team.unit_type||'Cấp phòng'
 };
}
function renderUserCatalogOptions(preferredTeam=''){
 const form=$('#newUserForm');
 const rankValue=form.rank.value;
 const positionValue=form.position.value;
 const teamValue=preferredTeam || form.team.value;
 const inferredDepartment=getDepartmentForTeam(teamValue);
 const unitTypeValue=inferredDepartment?.unit_type || form.unitType?.value || 'Cấp phòng';
 form.rank.innerHTML='<option value="">Không áp dụng</option>'+catalogs.ranks.map(item=>`<option>${escapeHtml(item)}</option>`).join('');
 form.position.innerHTML='<option value="">Không áp dụng</option>'+catalogs.positions.map(item=>`<option>${escapeHtml(item)}</option>`).join('');
 if(form.unitType){
  form.unitType.innerHTML='<option value="Cấp phòng">Cấp phòng</option><option value="Cấp xã">Cấp xã</option>';
  form.unitType.value=unitTypeValue==='Cấp xã'?'Cấp xã':'Cấp phòng';
 }
 const departments=departmentCatalog.filter(department=>(department.unit_type||'Cấp phòng')===(form.unitType?.value||'Cấp phòng'));
 const selectedDepartmentId=String(inferredDepartment?.id || form.departmentId?.value || departments[0]?.id || '');
 if(form.departmentId){
  const emptyLabel=(form.unitType?.value||'Cấp phòng')==='Cấp xã'?'Chưa có cấp xã':'Chưa có cấp phòng';
  form.departmentId.innerHTML=departments.length
   ? departments.map(department=>`<option value="${escapeHtml(department.id)}">${escapeHtml(department.name)}</option>`).join('')
   : `<option value="">${emptyLabel}</option>`;
  form.departmentId.value=departments.some(department=>String(department.id)===selectedDepartmentId)?selectedDepartmentId:(departments[0]?.id||'');
 }
 const isCommune=(form.unitType?.value||'Cấp phòng')==='Cấp xã';
 const assignmentLabel=isCommune?'Trạm':'Đội';
 const assignmentLabelNode=$('#userAssignmentLabel');
 if(assignmentLabelNode)assignmentLabelNode.textContent=assignmentLabel;
 const selectedDepartment=form.departmentId?.value||'';
 const assignmentOptions=teamCatalog.filter(item=>String(item.department_id||'')===String(selectedDepartment));
 form.team.innerHTML=`<option value="">Chọn ${assignmentLabel.toLowerCase()}</option>`+assignmentOptions.map(item=>`<option>${escapeHtml(item.name)}</option>`).join('');
 form.rank.value=catalogs.ranks.includes(rankValue)?rankValue:'';
 form.position.value=catalogs.positions.includes(positionValue)?positionValue:'';
 form.team.value=assignmentOptions.some(item=>item.name===teamValue)?teamValue:'';
}
async function saveUser(){
 const form=$('#newUserForm');
 if(!form.reportValidity())return;
 const f=new FormData(form);
 const normalizedUsername=sanitizeUsernameInput(f.get('username')||editingUser||'');
 form.username.value=normalizedUsername;
 const usernameError=getUsernameError(normalizedUsername);
 if(usernameError){toast(usernameError);form.username.focus();return}
 const payload={
  username:normalizedUsername,
  password:f.get('password')||'123456',
  fullname:f.get('fullname')||'',
  phone:f.get('phone')||'',
  rank:f.get('rank')||'',
  position:f.get('position')||'',
  unitType:f.get('unitType')||'',
  departmentId:f.get('departmentId')||'',
  departmentName:form.departmentId?.selectedOptions?.[0]?.textContent||'',
  team:f.get('team')||'',
  status:f.get('status')||'Hoạt động'
 };
 if(location.protocol!=='file:'){
  try{
   const isCreating=!editingUser;
   if(editingUser){
    await sendApi(`/api/accounts/${encodeURIComponent(editingUser)}`,'PUT',payload);
   }else{
    if(accounts.some(a=>a.u===payload.username)){toast('Tên đăng nhập đã tồn tại');return}
    await sendApi('/api/accounts','POST',payload);
   }
   const currentUsername=currentUser?.u;
   await loadDataFromDatabase();
   if(currentUsername){
    currentUser=accounts.find(account=>account.u===currentUsername)||accounts.find(account=>account.u===payload.username)||currentUser;
    if(currentUser) setLoginSession(currentUser.u);
   }
   if(editingUser && selectedRole===editingUser)selectedRole=payload.username;
   if(editingUser && selectedStaff===editingUser)selectedStaff=payload.username;
   $('#userModal').classList.remove('show');
   renderApp();
   toast(isCreating?'Tạo tài khoản thành công':'Đã cập nhật tài khoản');
   return;
  }catch(error){
   toast(error.message || 'Không lưu được xuống DB');
   return;
  }
 }
 if(editingUser){
  const user=accounts.find(a=>a.u===editingUser);
  const oldUsername=user.u;
  if(payload.username!==oldUsername && accounts.some(a=>a.u===payload.username)){toast('Tên đăng nhập đã tồn tại');return}
  if(user.u!=='admin')user.u=payload.username;
  user.password=f.get('password');
  user.name=f.get('fullname');
  user.phone=user.u==='admin'?'':f.get('phone')||'';
  user.rank=user.u==='admin'?'':f.get('rank');
  user.pos=user.u==='admin'?'':f.get('position');
  user.team=user.u==='admin'?'':f.get('team');
  user.status=user.u==='admin'?'Hoạt động':f.get('status');
  if(user.u!=='admin'){
   const profile=(oldUsername!==user.u && staffProfiles.find(item=>item.username===oldUsername)) || getStaffProfile(user.u);
   profile.username=user.u;
   profile.sections['Thông tin cá nhân']['Họ và tên']=user.name;
   profile.sections['Thông tin cá nhân']['Số điện thoại']=user.phone;
   profile.sections['Thông tin công tác']['Cấp bậc']=user.rank;
   profile.sections['Thông tin công tác']['Chức vụ hiện tại']=user.pos;
   profile.sections['Thông tin công tác']['Đơn vị công tác']=user.team;
  }
  if(oldUsername!==user.u){
   accountPerms[user.u]=accountPerms[oldUsername]||[];
   delete accountPerms[oldUsername];
   if(selectedRole===oldUsername)selectedRole=user.u;
   if(selectedStaff===oldUsername)selectedStaff=user.u;
   if(currentUser?.u===oldUsername){currentUser=user;setLoginSession(user.u)}
  }
  if(currentUser?.u===user.u){$('#currentUser').textContent=user.name}
 }else{
  const username=payload.username;
  if(accounts.some(a=>a.u===username)){toast('Tên đăng nhập đã tồn tại');return}
 accounts.unshift({u:username,password:f.get('password'),name:f.get('fullname'),rank:f.get('rank'),pos:f.get('position'),team:f.get('team'),phone:f.get('phone')||'',status:f.get('status'),role:'Cán bộ nghiệp vụ'});
  accountPerms[username]=[];
  getStaffProfile(username);
 }
 $('#userModal').classList.remove('show');
 renderAccounts();
 renderRoles();
 renderLogin();
 renderStaffDirectory();
 recalculateOrgStats();
 renderOrgTree();
 renderTeamAssets();
 toast(editingUser?'Đã cập nhật tài khoản':'Tạo tài khoản thành công');
}
function downloadAccountTemplate(){
 if(!window.XLSX){toast('Chưa tải được thư viện Excel');return}
 const rows=[
  accountImportColumns,
  ['phamvand','123456','Phạm Văn D','0900000004','Thiếu úy','Cán bộ','Cấp phòng','Phòng PV01','Đội tổng hợp','Hoạt động'],
  ['hoangthie','123456','Hoàng Thị E','0900000005','Trung úy','Phó đội trưởng','Cấp xã','Công an xã mẫu','Trạm tổng hợp','Hoạt động']
 ];
 const worksheet=XLSX.utils.aoa_to_sheet(rows);
 worksheet['!cols']=[{wch:18},{wch:14},{wch:24},{wch:16},{wch:14},{wch:20},{wch:16},{wch:24},{wch:20},{wch:16}];
 const workbook=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook,worksheet,'Tai_khoan_mau');
 XLSX.writeFile(workbook,'mau_nhap_tai_khoan.xlsx');
 toast('Đã xuất file mẫu Excel');
}
function openAccountImport(){
 $('#accountExcelInput').value='';
 $('#accountExcelInput').click();
}
function importAccountsFromExcel(event){
 const file=event.target.files[0];
 if(!file)return;
 if(!window.XLSX){toast('Chưa tải được thư viện Excel');return}
 const reader=new FileReader();
 reader.onload=async ()=>{
  try{
   const workbook=XLSX.read(reader.result,{type:'array'});
   const sheet=workbook.Sheets[workbook.SheetNames[0]];
   const rows=XLSX.utils.sheet_to_json(sheet,{defval:''});
   let added=0, skipped=0;
   const seen=new Set(accounts.map(account=>account.u));
   for(const row of rows){
    const username=sanitizeUsernameInput(row['Tên đăng nhập']||'');
    const password=String(row['Mật khẩu']||'').trim();
    const fullname=String(row['Họ tên']||'').trim();
    if(!username || !isValidUsername(username) || !password || !fullname || seen.has(username)){skipped++;continue}
    const status=String(row['Trạng thái']||'Hoạt động').trim();
    const payload={
     username,
     password,
     fullname,
     phone:String(row['Số điện thoại']||'').trim(),
     rank:String(row['Cấp bậc']||'').trim(),
     position:String(row['Chức vụ']||'').trim(),
     unitType:String(row['Loại đơn vị']||'').trim(),
     departmentName:String(row['Đơn vị']||'').trim(),
     team:String(row['Đội/Trạm']||row['Đội']||'').trim(),
     status:status==='Tạm khóa'?'Tạm khóa':'Hoạt động'
    };
    if(location.protocol!=='file:'){
     try{
      await sendApi('/api/accounts','POST',payload);
     }catch(error){
      skipped++;
      continue;
     }
    }else{
     accounts.push({u:username,password,name:fullname,phone:payload.phone,rank:payload.rank,pos:payload.position,team:payload.team,status:payload.status,role:'Cán bộ nghiệp vụ'});
     accountPerms[username]=['Quản lý hồ sơ cán bộ'];
     getStaffProfile(username);
    }
    seen.add(username);
    added++;
   }
   if(location.protocol!=='file:')await loadDataFromDatabase();
   renderAccounts();
   renderRoles();
   renderLogin();
   renderStaffDirectory();
   toast(`Đã nhập ${added} tài khoản${skipped?`, bỏ qua ${skipped} dòng`:''}`);
  }catch(error){
   toast('File Excel không đúng định dạng');
  }
 };
 reader.readAsArrayBuffer(file);
}

function downloadAssetTemplate(){
 if(!window.XLSX){toast('Chưa tải được thư viện Excel');return}
 const rows=[
  assetImportColumns,
  ['TB010','Máy tính xách tay Dell Latitude','PC','Đang sử dụng','22000000','02/06/2026','Đội CNTT','Vũ Thành Công Duy','Máy cấp mới'],
  ['TB011','Điện thoại iPhone 15','Di động','Bảo trì','18000000','02/06/2026','Đội tổng hợp','Trần Thị B','Đang kiểm tra pin']
 ];
 const worksheet=XLSX.utils.aoa_to_sheet(rows);
 worksheet['!cols']=[{wch:14},{wch:32},{wch:18},{wch:18},{wch:16},{wch:14},{wch:22},{wch:26},{wch:34}];
 const workbook=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook,worksheet,'Tai_san_mau');
 XLSX.writeFile(workbook,'mau_nhap_tai_san.xlsx');
 toast('Đã xuất file mẫu tài sản');
}
function openAssetImport(){
 $('#assetExcelInput').value='';
 $('#assetExcelInput').click();
}
function normalizeExcelDateValue(value){
 if(value === null || value === undefined)return '';
 if(typeof value === 'number' && window.XLSX?.SSF)return XLSX.SSF.format('dd/mm/yyyy',value);
 return String(value).trim();
}
function importAssetsFromExcel(event){
 const file=event.target.files[0];
 if(!file)return;
 if(!window.XLSX){toast('Chưa tải được thư viện Excel');return}
 const reader=new FileReader();
 reader.onload=async ()=>{
  try{
   const workbook=XLSX.read(reader.result,{type:'array'});
   const sheet=workbook.Sheets[workbook.SheetNames[0]];
   const rows=XLSX.utils.sheet_to_json(sheet,{defval:''});
   let added=0, skipped=0;
   const seen=new Set(assets.map(asset=>asset.id));
   for(const row of rows){
    const id=String(row['Mã tài sản']||'').trim();
    const name=String(row['Tên tài sản']||'').trim();
    if(!id || !name || seen.has(id)){skipped++;continue}
    const next={
     id,
     name,
     type:String(row['Chủng loại']||'').trim(),
     status:String(row['Hiện trạng']||'Đang sử dụng').trim() || 'Đang sử dụng',
     value:String(row['Nguyên giá']||'').trim(),
     date:normalizeExcelDateValue(row['Ngày nhận']),
     unit:String(row['Đơn vị quản lý']||'').trim(),
     owner:String(row['Người quản lý']||'').trim(),
     note:String(row['Ghi chú']||'').trim()
    };
    if(location.protocol!=='file:'){
     try{
      await sendApi('/api/assets','POST',next);
     }catch(error){
      skipped++;
      continue;
     }
    }else{
     assets.unshift(next);
     if(next.type && !assetCategories.includes(next.type))assetCategories.push(next.type);
    }
    seen.add(id);
    added++;
   }
   if(location.protocol!=='file:')await loadDataFromDatabase();
   renderAssetRows();
   renderTeamAssets();
   renderReports();
   renderAssetCategories();
   switchAssetPanel('assetList');
   toast(`Đã nhập ${added} tài sản${skipped?`, bỏ qua ${skipped} dòng`:''}`);
  }catch(error){
   toast('File Excel tài sản không đúng định dạng');
  }
 };
 reader.readAsArrayBuffer(file);
}

function renderRoles(){
 selectedRole=accounts.some(a=>a.u===selectedRole)?selectedRole:accounts[0].u;
 $('#roleList').innerHTML=accounts.map(a=>`<button class="role-card ${a.u===selectedRole?'active':''}" data-role="${a.u}"><i data-lucide="${a.u==='admin'?'shield':'user-round'}"></i><span>${escapeHtml(a.name)}<small>${escapeHtml(a.role)}</small></span></button>`).join('');
 renderPerms(selectedRole);
 $all('#roleList button').forEach(b=>b.onclick=()=>{selectedRole=b.dataset.role;permissionsDirty=false;renderRoles()});
 refreshIcons();
}
function setPermissionSaveState(enabled){
 const saveButton=$('#savePerm');
 if(!saveButton)return;
 saveButton.disabled=!enabled;
 saveButton.classList.toggle('disabled',!enabled);
}
function renderPerms(username){
 const user=accounts.find(a=>a.u===username);
 $('#roleName').textContent='Quyền chức năng: '+(user?.name||username);
 if(username==='admin'){
  $('#roleName').textContent='Quyền chức năng: Admin';
  $('#permList').innerHTML=`
   <div class="admin-permission-state">
    <span class="detail-title-icon"><i data-lucide="shield-check"></i></span>
    <div>
     <strong>Admin toàn quyền hệ thống</strong>
     <p>Admin là quyền cao nhất nên mặc định được hiển thị và sử dụng tất cả module. Không cần phân quyền thủ công.</p>
    </div>
   </div>`;
  setPermissionSaveState(false);
  refreshIcons();
  return;
 }
 const selected=accountPerms[username]||[];
 const icons={
  'Quản lý hệ thống':'settings',
  'Quản lý hồ sơ cán bộ':'id-card',
  'Quản lý tài sản':'package-check',
  'Quản lý phân quyền phần mềm':'shield-check',
  'Báo cáo thống kê':'chart-column',
  'Xuất dữ liệu':'download',
  'Quản lý đội':'users-round',
  'Quản lý đơn vị':'building-2',
  'Quản lý danh mục':'list-plus',
  'Quản lý module':'layout-dashboard',
  'Quản lý danh mục tài sản':'boxes',
  'Quản lý cán bộ':'contact-round'
 };
 $('#permList').innerHTML=perms.map(p=>`
  <label class="perm-row">
   <span><input type="checkbox" value="${escapeHtml(p)}" ${selected.includes(p)?'checked':''}/><i data-lucide="${icons[p]||'circle-check'}"></i> ${escapeHtml(p)}</span>
   <button class="link-btn icon-button" data-delete-permission="${escapeHtml(p)}" type="button"><i data-lucide="trash-2"></i>Xóa</button>
  </label>`).join('');
 permissionsDirty=false;
 setPermissionSaveState(false);
 $all('#permList input[type="checkbox"]').forEach(input=>input.onchange=()=>{permissionsDirty=true;setPermissionSaveState(true)});
 $all('[data-delete-permission]').forEach(button=>button.onclick=()=>deletePermission(button.dataset.deletePermission));
 refreshIcons();
}
async function deletePermission(permissionName){
 if(!confirm(`Xóa quyền "${permissionName}"?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/permissions/${encodeURIComponent(permissionName)}`,'DELETE',{});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được quyền');
   return;
  }
 }else{
  const index=perms.indexOf(permissionName);
  if(index>=0)perms.splice(index,1);
  Object.keys(accountPerms).forEach(username=>{
   accountPerms[username]=(accountPerms[username]||[]).filter(item=>item!==permissionName);
  });
 }
 renderRoles();
 updateModuleVisibility();
 toast('Đã xóa quyền');
}
async function savePerms(){
 if(selectedRole==='admin'){
  toast('Admin mặc định có toàn quyền');
  setPermissionSaveState(false);
  return;
 }
 if(!permissionsDirty){
  toast('Chưa có thay đổi phân quyền');
  setPermissionSaveState(false);
  return;
 }
 const selected=$all('#permList input:checked').map(i=>i.value);
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/user-permissions/${encodeURIComponent(selectedRole)}`,'PUT',{permissions:selected});
   const dbPerms=await fetchApi('/api/user-permissions');
   Object.keys(accountPerms).forEach(key=>delete accountPerms[key]);
   Object.assign(accountPerms,dbPerms);
  }catch(error){
   toast(error.message || 'Không lưu được phân quyền');
   return;
  }
 }else{
  accountPerms[selectedRole]=selected;
 }
 updateModuleVisibility();
 if(currentUser?.u===selectedRole && currentUser.u!=='admin')showPage(getFirstUserPage());
 permissionsDirty=false;
 renderRoles();
 toast('Đã lưu phân quyền');
}

function persistActiveStaffForm(){
 if(!$('#staffForm'))return;
 const data=new FormData($('#staffForm'));
 staffTabs[activeStaffTab].forEach(field=>{
  const value=data.get(field)||'';
  staffData[activeStaffTab][field]=dateFields.has(field)?fromDateInputValue(value):value;
 });
}
function syncCurrentStaffToAccount(){
 if(!currentUser || currentUser.u==='admin')return;
 const profile=getStaffProfile(currentUser.u);
 Object.keys(staffTabs).forEach(tab=>profile.sections[tab]={...(staffData[tab]||{})});
 profile.photo=staffAvatarSrc;
 const personal=profile.sections['Thông tin cá nhân']||{};
 const work=profile.sections['Thông tin công tác']||{};
 currentUser.name=personal['Họ và tên']||currentUser.name;
 currentUser.phone=personal['Số điện thoại']||currentUser.phone;
 currentUser.rank=work['Cấp bậc']||currentUser.rank;
 currentUser.pos=work['Chức vụ hiện tại']||currentUser.pos;
 $('#currentUser').textContent=currentUser.name;
 renderHeaderMeta();
 renderAccounts();
 renderRoles();
 renderLogin();
 renderStaffDirectory();
}
function renderStaff(tab=activeStaffTab){
 activeStaffTab=tab;
 $('#staffTabs').innerHTML=Object.keys(staffTabs).map(t=>`<button class="tab ${t==tab?'active':''}" data-tab="${t}">${t}</button>`).join('');
 $('#staffForm').innerHTML=staffTabs[tab].map(f=>renderStaffField(f,staffData[tab][f]||'')).join('');
 $all('#staffTabs .tab').forEach(b=>b.onclick=()=>{persistActiveStaffForm();syncCurrentStaffToAccount();renderStaff(b.dataset.tab)});
}
function renderStaffField(field,value){
 if(dateFields.has(field)){
  return `<label>${escapeHtml(field)}<input type="date" name="${escapeHtml(field)}" value="${escapeHtml(toDateInputValue(value))}"/></label>`;
 }
 if(field==='Giới tính'){
  return `<label>${escapeHtml(field)}<select name="${escapeHtml(field)}">${renderSelectOptions(genderOptions,value,'Chọn giới tính')}</select></label>`;
 }
 if(field==='Tình trạng hôn nhân'){
  return `<label>${escapeHtml(field)}<select name="${escapeHtml(field)}">${renderSelectOptions(maritalOptions,value,'Chọn tình trạng')}</select></label>`;
 }
 return `<label>${escapeHtml(field)}<input name="${escapeHtml(field)}" placeholder="Nhập ${field.toLowerCase()}" value="${escapeHtml(value)}"/></label>`;
}
function loadStaffDataForCurrentUser(){
 if(!currentUser || currentUser.u==='admin')return;
 const profile=getStaffProfile(currentUser.u);
 Object.keys(staffTabs).forEach(tab=>staffData[tab]={...(profile?.sections[tab]||{})});
 staffAvatarSrc=profile?.photo||'';
 if($('#staffForm'))renderStaff(activeStaffTab);
 if($('#staffAvatar'))renderAvatar();
}
function openStaffUpdate(){
 if(!currentUser || currentUser.u==='admin')return;
 loadStaffDataForCurrentUser();
 showPage('staff');
 $('#staff')?.classList.remove('hidden');
 $('#staffForm')?.scrollIntoView({behavior:'smooth',block:'start'});
}
async function saveStaff(event){
 event.preventDefault();
 persistActiveStaffForm();
 syncCurrentStaffToAccount();
 if(location.protocol!=='file:' && currentUser?.u && currentUser.u!=='admin'){
  try{
   const profile=getStaffProfile(currentUser.u);
   await sendApi(`/api/staff/${encodeURIComponent(currentUser.u)}`,'PUT',{
    sections:profile.sections,
    photo:profile.photo||''
   });
  }catch(error){
   toast(error.message || 'Không lưu được hồ sơ cán bộ');
   return;
  }
 }
 renderStaffDirectory();
 showPage('staffDirectory');
 toast('Đã cập nhật hồ sơ cán bộ');
}
function uploadAvatar(){
 $('#avatarInput').click();
}
function handleAvatarFile(){
 const file=$('#avatarInput').files[0];
 if(!file)return;
 if(!file.type.startsWith('image/')){toast('Vui lòng chọn file ảnh');return}
 const reader=new FileReader();
 reader.onload=()=>{staffAvatarSrc=reader.result;if(currentUser && currentUser.u!=='admin'){getStaffProfile(currentUser.u).photo=staffAvatarSrc}renderAvatar();renderStaffDirectory();toast('Đã tải ảnh hồ sơ')};
 reader.readAsDataURL(file);
}
function renderAvatar(){
 $('#staffAvatar').innerHTML=staffAvatarSrc?`<img src="${staffAvatarSrc}" alt="Ảnh hồ sơ cán bộ"/>`:'👤';
}
function renderStaffDirectory(){
 const container=$('#staffDirectoryRows');
 const detail=$('#staffProfileDetail');
 if(!container || !detail)return;
 $('#staffDirectory')?.classList.toggle('staff-self-mode',!isAdminUser());
 const title=$('#staffDirectory .card-head h2');
 if(title)title.textContent=isAdminUser()?'Quản lý cán bộ theo đội':'Hồ sơ cán bộ của tôi';
 if(!isAdminUser()){
  selectedStaff=currentUser?.u||'';
  const account=currentUser;
  const profile=getStaffProfile(account.u);
  const personal=profile.sections['Thông tin cá nhân']||{};
  const work=profile.sections['Thông tin công tác']||{};
  container.innerHTML=`<div class="staff-self-card">
   <div class="staff-self-top">
    <span class="profile-photo large">${profile.photo?`<img src="${profile.photo}" alt="Ảnh ${escapeHtml(account.name)}"/>`:escapeHtml(getInitials(account.name))}</span>
    <div>
     <span class="profile-chip"><i data-lucide="badge-check"></i>Hồ sơ cá nhân</span>
     <h3>${escapeHtml(personal['Họ và tên']||account.name)}</h3>
     <p>${escapeHtml(work['Cấp bậc']||account.rank||'--')} · ${escapeHtml(work['Chức vụ hiện tại']||account.pos||'--')}</p>
    </div>
   </div>
   <div class="staff-self-meta">
    <span><i data-lucide="id-card"></i><small>Số hiệu</small><strong>${escapeHtml(account.u)}</strong></span>
    <span><i data-lucide="phone"></i><small>Liên hệ</small><strong>${escapeHtml(personal['Số điện thoại']||account.phone||'Chưa cập nhật')}</strong></span>
    <span><i data-lucide="building-2"></i><small>Đơn vị</small><strong>${escapeHtml(work['Đơn vị công tác']||account.team||'Chưa cập nhật đội')}</strong></span>
    <span><i data-lucide="${account.status==='Hoạt động'?'check-circle':'lock'}"></i><small>Trạng thái</small><strong>${escapeHtml(account.status)}</strong></span>
   </div>
   <button class="primary icon-button staff-update-button" data-update-self-profile type="button"><i data-lucide="user-pen"></i>Cập nhật thông tin</button>
  </div>`;
  renderStaffProfileDetail(account.u);
  $all('[data-update-self-profile]').forEach(button=>button.onclick=openStaffUpdate);
  refreshIcons();
  return;
 }
 const q=($('#staffDirectorySearch')?.value||'').toLowerCase();
 const positionFilter=$('#staffPositionFilter')?.value||'';
 const rankFilter=$('#staffRankFilter')?.value||'';
 const teamFilter=$('#staffTeamFilter')?.value||'';
 const staffAccounts=accounts.filter(a=>a.u!=='admin');
 renderStaffDirectoryFilters(staffAccounts);
 const teamNames=[...new Set([
  ...teams.map(team=>team.name),
  ...staffAccounts.map(account=>getStaffProfile(account.u).sections['Thông tin công tác']?.['Đơn vị công tác']).filter(Boolean)
 ])].filter(Boolean);
 if(teamFilter && teamFilter!==selectedStaffTeam)selectedStaffTeam=teamFilter;
 if(!teamNames.includes(selectedStaffTeam))selectedStaffTeam=teamNames[0]||'';
 const filtered=staffAccounts.filter(a=>{
  const profile=getStaffProfile(a.u);
  const work=profile.sections['Thông tin công tác']||{};
  const nameMatch=JSON.stringify({account:a,profile}).toLowerCase().includes(q);
  const positionMatch=!positionFilter || (work['Chức vụ hiện tại']||a.pos)===positionFilter;
  const rankMatch=!rankFilter || (work['Cấp bậc']||a.rank)===rankFilter;
  const teamMatch=(work['Đơn vị công tác']||'')===selectedStaffTeam;
  return nameMatch && positionMatch && rankMatch && teamMatch;
 });
 if(!filtered.some(account=>account.u===selectedStaff))selectedStaff='';
 container.innerHTML=`
  <div class="team-filter-list">
   ${teamNames.map(teamName=>{
    const count=staffAccounts.filter(account=>getStaffProfile(account.u).sections['Thông tin công tác']?.['Đơn vị công tác']===teamName).length;
    return `<button class="team-filter-card ${teamName===selectedStaffTeam?'active':''}" data-staff-team="${escapeHtml(teamName)}"><i data-lucide="users-round"></i><span>${escapeHtml(teamName)}<small>${count} cán bộ</small></span></button>`;
   }).join('') || '<p class="section-note">Chưa có đội.</p>'}
  </div>
  <div class="staff-team-list">
   ${filtered.map(account=>{
  const profile=getStaffProfile(account.u);
  const personal=profile.sections['Thông tin cá nhân']||{};
  const work=profile.sections['Thông tin công tác']||{};
  return `<button class="staff-card ${account.u===selectedStaff?'active':''}" data-staff="${account.u}">
   <span class="profile-photo">${profile.photo?`<img src="${profile.photo}" alt="Ảnh ${escapeHtml(account.name)}"/>`:escapeHtml(getInitials(account.name))}</span>
   <span><strong>${escapeHtml(personal['Họ và tên']||account.name)}</strong><small><i data-lucide="id-card"></i>Số hiệu: ${escapeHtml(account.u)}</small><small><i data-lucide="phone"></i>SĐT: ${escapeHtml(personal['Số điện thoại']||account.phone||'Chưa cập nhật')}</small></span>
  </button>`;
 }).join('') || '<p class="section-note">Không tìm thấy cán bộ phù hợp trong đội này.</p>'}
  </div>`;
 $all('[data-staff-team]').forEach(button=>button.onclick=()=>{
  selectedStaffTeam=button.dataset.staffTeam;
  selectedStaff='';
  if($('#staffTeamFilter'))$('#staffTeamFilter').value=selectedStaffTeam;
  renderStaffDirectory();
 });
 $all('[data-staff]').forEach(b=>b.onclick=()=>{selectedStaff=b.dataset.staff;renderStaffDirectory()});
 if(selectedStaff)renderStaffProfileDetail(selectedStaff);
 else detail.innerHTML='<div class="empty compact-empty"><div class="empty-icon"><i data-lucide="id-card"></i></div><h3>Chọn cán bộ để xem hồ sơ</h3><p>Bấm vào một cán bộ trong đội để xem toàn bộ thông tin cá nhân, công tác và tài liệu.</p></div>';
 refreshIcons();
}
function renderStaffDirectoryFilters(staffAccounts){
 const controls=[
  ['#staffPositionFilter','Tất cả chức vụ',account=>getStaffProfile(account.u).sections['Thông tin công tác']?.['Chức vụ hiện tại']||account.pos],
  ['#staffRankFilter','Tất cả chức hàm',account=>getStaffProfile(account.u).sections['Thông tin công tác']?.['Cấp bậc']||account.rank],
  ['#staffTeamFilter','Tất cả đội',account=>getStaffProfile(account.u).sections['Thông tin công tác']?.['Đơn vị công tác']||'']
 ];
 controls.forEach(([selector,label,getValue])=>{
  const select=$(selector);
  if(!select)return;
  const current=select.value;
  const values=[...new Set(staffAccounts.map(getValue).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
  select.innerHTML=`<option value="">${label}</option>`+values.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  select.value=values.includes(current)?current:'';
 });
}
function renderStaffProfileDetail(username){
 const account=accounts.find(a=>a.u===username);
 const profile=getStaffProfile(username);
 if(!account || !profile){$('#staffProfileDetail').innerHTML='<p class="section-note">Chưa có dữ liệu cán bộ.</p>';return}
 const personal=profile.sections['Thông tin cá nhân']||{};
 const work=profile.sections['Thông tin công tác']||{};
 const blocks=Object.keys(staffTabs).map(tab=>{
  const data=profile.sections[tab]||{};
  const rows=staffTabs[tab].map(field=>`<div class="detail-row"><span>${escapeHtml(field)}</span><span>${escapeHtml(data[field]||'--')}</span></div>`).join('');
  return `<div class="detail-block"><h4>${escapeHtml(tab)}</h4>${rows}</div>`;
 }).join('');
 $('#staffProfileDetail').innerHTML=`
  <div class="profile-head">
   <span class="profile-photo large">${profile.photo?`<img src="${profile.photo}" alt="Ảnh ${escapeHtml(account.name)}"/>`:escapeHtml(getInitials(account.name))}</span>
   <div>
    <span class="profile-chip"><i data-lucide="shield-user"></i>Thông tin định danh</span>
    <h3>${escapeHtml(personal['Họ và tên']||account.name)}</h3>
    <p>${escapeHtml(work['Cấp bậc']||account.rank||'--')} · ${escapeHtml(work['Chức vụ hiện tại']||account.pos||'--')} · ${escapeHtml(work['Đơn vị công tác']||'--')}</p>
    <div class="profile-mini-grid">
     <span><small>Tài khoản</small><strong>${escapeHtml(account.u)}</strong></span>
     <span><small>Vai trò</small><strong>${escapeHtml(account.role)}</strong></span>
     <span><small>Trạng thái</small><strong>${escapeHtml(account.status)}</strong></span>
    </div>
    ${!isAdminUser() && account.u===currentUser?.u ? `<button class="primary icon-button staff-update-button" data-update-self-profile type="button"><i data-lucide="user-pen"></i>Cập nhật thông tin</button>` : ''}
   </div>
  </div>
  <div class="detail-grid">${blocks}</div>`;
 $all('[data-update-self-profile]').forEach(button=>button.onclick=openStaffUpdate);
 refreshIcons();
}
function renderModuleSettings(){
 const container=$('#moduleSettings');
 if(!container)return;
 if(!moduleDefinitions.length)rebuildModuleDefinitions([]);
 const managedModules=moduleDefinitions.filter(module=>module.key!=='staff');
 if(!managedModules.length){
  rebuildModuleDefinitions([]);
  return renderModuleSettings();
 }
 container.innerHTML=managedModules.map(module=>`
  <div class="module-setting">
   <div class="module-setting-main">
    <span class="module-setting-icon"><i data-lucide="${module.icon || (module.key==='assets'?'package-check':'blocks')}"></i></span>
    <div>
     <strong>${escapeHtml(module.name)}</strong>
     <span>${escapeHtml(module.description)}</span>
    </div>
   </div>
   <div class="module-setting-actions">
    <span class="module-state ${moduleVisibility[module.key]?'is-on':'is-off'}"><i data-lucide="${moduleVisibility[module.key]?'eye':'eye-off'}"></i>${moduleVisibility[module.key]?'Đang hiển thị':'Đang ẩn'}</span>
    <label class="switch" aria-label="Bật tắt ${escapeHtml(module.name)}">
     <input type="checkbox" data-module-toggle="${module.key}" ${moduleVisibility[module.key]?'checked':''}/>
     <span class="slider"></span>
    </label>
    <button class="module-action" data-edit-module="${module.key}" type="button" title="Sửa module" aria-label="Sửa ${escapeHtml(module.name)}"><i data-lucide="square-pen"></i></button>
    <button class="module-action danger-action" data-delete-module="${module.key}" type="button" title="Xóa module" aria-label="Xóa ${escapeHtml(module.name)}"><i data-lucide="trash-2"></i></button>
   </div>
  </div>`).join('');
 $all('[data-module-toggle]').forEach(input=>input.onchange=()=>toggleModule(input.dataset.moduleToggle,input.checked));
 $all('[data-edit-module]').forEach(button=>button.onclick=()=>editModule(button.dataset.editModule));
 $all('[data-delete-module]').forEach(button=>button.onclick=()=>deleteModule(button.dataset.deleteModule));
 refreshIcons();
}
function renderSettings(){
 const themeButtons=$all('[data-theme-choice]');
 const accentButtons=$all('[data-accent-choice]');
 const densityButtons=$all('[data-density-choice]');
 themeButtons.forEach(button=>{
  button.classList.toggle('active',button.dataset.themeChoice===appearanceSettings.theme);
  button.onclick=()=>{appearanceSettings.theme=button.dataset.themeChoice;saveAppearanceSettings()};
 });
 accentButtons.forEach(button=>{
  button.classList.toggle('active',button.dataset.accentChoice===appearanceSettings.accent);
  button.onclick=()=>{appearanceSettings.accent=button.dataset.accentChoice;saveAppearanceSettings()};
 });
 densityButtons.forEach(button=>{
  button.classList.toggle('active',button.dataset.densityChoice===appearanceSettings.density);
  button.onclick=()=>{appearanceSettings.density=button.dataset.densityChoice;saveAppearanceSettings()};
 });
 const motionToggle=$('#motionToggle');
 if(motionToggle){
  motionToggle.checked=Boolean(appearanceSettings.motion);
  motionToggle.onchange=()=>{appearanceSettings.motion=motionToggle.checked;saveAppearanceSettings()};
 }
 const reset=$('#resetAppearance');
 if(reset)reset.onclick=()=>{
  appearanceSettings={...appearanceDefaults};
  saveAppearanceSettings();
  toast('Đã khôi phục giao diện mặc định');
 };
 refreshIcons();
}
function renderDynamicModuleShells(){
 const nav=document.querySelector('.sidebar nav');
 const main=document.querySelector('.main');
 moduleDefinitions.filter(module=>module.custom).forEach(module=>{
  if(!document.querySelector(`.nav-item[data-page="${module.key}"]`)){
   const button=document.createElement('button');
   button.className='nav-item user-module';
   button.dataset.moduleKey=module.key;
   button.dataset.page=module.key;
   button.innerHTML=`<span><i data-lucide="blocks"></i></span>${escapeHtml(module.name)}`;
   button.onclick=()=>showPage(module.key);
   nav.appendChild(button);
  }
  if(!document.getElementById(module.key)){
   const section=document.createElement('section');
   section.id=module.key;
   section.className='page';
   section.innerHTML=`<div class="card empty"><div class="empty-icon"><i data-lucide="blocks"></i></div><h3>${escapeHtml(module.name)}</h3><p>${escapeHtml(module.description || 'Module tùy chỉnh đang ở trạng thái demo giao diện.')}</p></div>`;
   main.appendChild(section);
  }
 });
 refreshIcons();
}
async function addModule(){
 const name=$('#newModuleName').value.trim();
 const description=$('#newModuleDescription').value.trim() || 'Module tùy chỉnh đang ở trạng thái demo giao diện.';
 if(!name){toast('Vui lòng nhập tên module');return}
 let key=slugify(name);
 let index=2;
 while(moduleDefinitions.some(module=>module.key===key) || document.getElementById(key)){
  key=`${slugify(name)}-${index++}`;
 }
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/modules','POST',{moduleKey:key,name,description,icon:'blocks',visible:true,isAdminOnly:false});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không tạo được module');
   return;
  }
 }else{
  const permissionName='Quản lý '+name.toLowerCase();
  moduleDefinitions.push({key,name,description,custom:true,icon:'blocks'});
  moduleVisibility[key]=true;
  permissionModuleMap[permissionName]=key;
  perms.push(permissionName);
  accountPerms.admin=perms;
 }
 $('#newModuleName').value='';
 $('#newModuleDescription').value='';
 renderDynamicModuleShells();
 renderModuleSettings();
 renderRoles();
 updateModuleVisibility();
 toast('Đã tạo module mới');
}
async function editModule(key){
 const module=moduleDefinitions.find(item=>item.key===key);
 if(!module)return;
 const name=prompt('Tên module',module.name);
 if(name===null)return;
 const trimmedName=name.trim();
 if(!trimmedName){toast('Tên module không được trống');return}
 const description=prompt('Mô tả module',module.description||'');
 if(description===null)return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/modules/${encodeURIComponent(key)}`,'PUT',{name:trimmedName,description:description.trim()});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không sửa được module');
   return;
  }
 }else{
  module.name=trimmedName;
  module.description=description.trim();
 }
 renderModuleSettings();
 updateModuleVisibility();
 toast('Đã cập nhật module');
}
async function deleteModule(key){
 const module=moduleDefinitions.find(item=>item.key===key);
 if(!module)return;
 if(!confirm(`Xóa module "${module.name}"?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/modules/${encodeURIComponent(key)}`,'DELETE',{});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được module');
   return;
  }
 }else{
  const index=moduleDefinitions.findIndex(item=>item.key===key);
  if(index>=0)moduleDefinitions.splice(index,1);
  delete moduleVisibility[key];
 }
 renderDynamicModuleShells();
 renderModuleSettings();
 updateModuleVisibility();
 toast('Đã xóa module');
}
async function toggleModule(key, enabled){
 const enabledCount=Object.entries(moduleVisibility).filter(([moduleKey,value])=>moduleKey!==key && value).length;
 if(!enabled && enabledCount===0){toast('Cần bật ít nhất một module cho tài khoản thường');renderModuleSettings();return}
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/modules/${encodeURIComponent(key)}`,'PUT',{visible:enabled});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không cập nhật được module');
   renderModuleSettings();
   return;
  }
 }else{
  moduleVisibility[key]=enabled;
 }
 updateModuleVisibility();
 renderModuleSettings();
 if(currentUser?.u!=='admin' && !canAccessModule(key))showPage(getFirstUserPage());
 toast('Đã cập nhật hiển thị module');
}

function renderTeamManager(){
 const departmentList=$('#departmentList');
 const teamList=$('#teamManagerList');
 const select=$('#teamDepartmentSelect');
 if(!departmentList || !teamList || !select)return;
 recalculateOrgStats();
 $('#unitCountLabel').textContent=`${departmentCatalog.length} đơn vị`;
 $('#teamCountLabel').textContent=`${teamCatalog.length} đội/trạm`;
 const previousDepartmentId=select.value;
 select.innerHTML=departmentCatalog.map(department=>`<option value="${department.id}">${escapeHtml(department.name)} · ${escapeHtml(department.unit_type||'Cấp phòng')}</option>`).join('');
 if(departmentCatalog.some(department=>String(department.id)===String(previousDepartmentId))){
  select.value=previousDepartmentId;
 }else if(departmentCatalog[0]){
  select.value=departmentCatalog[0].id;
 }
 const selectedDepartment=departmentCatalog.find(department=>String(department.id)===String(select.value));
 const newTeamInput=$('#newTeamManagerName');
 const newTeamButton=$('#addManagedTeam');
 if(newTeamInput)newTeamInput.placeholder=`Nhập tên ${getAssignmentName(selectedDepartment?.unit_type)} mới`;
 if(newTeamButton)newTeamButton.innerHTML=`<i data-lucide="plus"></i>Thêm ${getAssignmentName(selectedDepartment?.unit_type)}`;
 departmentList.innerHTML=departmentCatalog.map(department=>`
  <div class="unit-item">
   <span class="unit-icon"><i data-lucide="${department.unit_type==='Cấp xã'?'map-pin-house':'building-2'}"></i></span>
   <div class="unit-main">
    <div class="unit-title-row">
     <strong>${escapeHtml(department.name)}</strong>
     <span class="unit-type ${department.unit_type==='Cấp xã'?'commune':'room'}">${escapeHtml(department.unit_type||'Cấp phòng')}</span>
    </div>
    <small>${department.team_count||0} ${getAssignmentName(department.unit_type)} · ${department.staff_count||0} cán bộ · ${department.asset_count||0} tài sản</small>
   </div>
   <div class="catalog-actions">
    <button class="mini-action" data-edit-department="${department.id}" title="Sửa đơn vị" type="button"><i data-lucide="square-pen"></i></button>
    <button class="mini-action danger-action" data-delete-department="${department.id}" title="Xóa đơn vị" type="button"><i data-lucide="trash-2"></i></button>
   </div>
  </div>`).join('') || '<p class="section-note">Chưa có cấp phòng/cấp xã nào.</p>';
 const teamsByDepartment=new Map();
 teamCatalog.forEach(team=>{
  const key=String(team.department_id || 'none');
  if(!teamsByDepartment.has(key))teamsByDepartment.set(key,[]);
  teamsByDepartment.get(key).push(team);
 });
 teamList.innerHTML=departmentCatalog.map(department=>{
  const teamsInDepartment=teamsByDepartment.get(String(department.id))||[];
 return `<div class="team-group">
   <div class="team-group-head"><span><i data-lucide="${department.unit_type==='Cấp xã'?'map-pin-house':'building-2'}"></i>${escapeHtml(department.name)}</span><b>${teamsInDepartment.length} ${getAssignmentName(department.unit_type)}</b></div>
   <div class="team-group-list">
    ${teamsInDepartment.map(team=>`
     <div class="team-manager-item">
      <span class="team-item-icon"><i data-lucide="${department.unit_type==='Cấp xã'?'map-pinned':'users-round'}"></i></span>
      <div>
       <strong>${escapeHtml(team.name)}</strong>
       <span>${escapeHtml(team.unit_type||department.unit_type||'Cấp phòng')} · ${team.staff_count||0} cán bộ · ${team.asset_count||0} tài sản</span>
      </div>
      <div class="catalog-actions">
       <button class="mini-action" data-edit-team="${team.id}" title="Sửa ${getAssignmentName(department.unit_type)}" type="button"><i data-lucide="square-pen"></i></button>
       <button class="mini-action danger-action" data-delete-team="${team.id}" title="Xóa ${getAssignmentName(department.unit_type)}" type="button"><i data-lucide="trash-2"></i></button>
      </div>
     </div>`).join('') || `<p class="section-note">Chưa có ${getAssignmentName(department.unit_type)} trực thuộc đơn vị này.</p>`}
   </div>
  </div>`;
 }).join('') || '<p class="section-note">Tạo cấp phòng hoặc cấp xã trước khi thêm đội.</p>';
 $all('[data-edit-department]').forEach(button=>button.onclick=()=>editDepartment(Number(button.dataset.editDepartment)));
 $all('[data-delete-department]').forEach(button=>button.onclick=()=>deleteDepartment(Number(button.dataset.deleteDepartment)));
 $all('[data-edit-team]').forEach(button=>button.onclick=()=>editManagedTeam(Number(button.dataset.editTeam)));
 $all('[data-delete-team]').forEach(button=>button.onclick=()=>deleteManagedTeam(Number(button.dataset.deleteTeam)));
 refreshIcons();
}
async function addDepartment(){
 const nameInput=$('#newDepartmentName');
 const typeInput=$('#newDepartmentType');
 const name=nameInput.value.trim();
 const unitType=typeInput.value;
 if(!name){toast('Vui lòng nhập tên đơn vị');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/departments','POST',{name,unitType});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được đơn vị');
   return;
  }
 }else{
  departmentCatalog.push({id:Date.now(),name,unit_type:unitType,team_count:0,staff_count:0,asset_count:0});
  saveLocalOrgData();
 }
 nameInput.value='';
 renderTeamManager();
 toast('Đã thêm đơn vị');
}
async function editDepartment(id){
 const department=departmentCatalog.find(item=>Number(item.id)===id);
 if(!department)return;
 const nameValue=prompt('Tên đơn vị',department.name);
 if(nameValue===null)return;
 const name=nameValue.trim();
 if(!name){toast('Tên đơn vị không được trống');return}
 const typeValue=prompt('Loại đơn vị: Cấp phòng hoặc Cấp xã',department.unit_type||'Cấp phòng');
 if(typeValue===null)return;
 const unitType=typeValue.trim()==='Cấp xã'?'Cấp xã':'Cấp phòng';
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/departments/${id}`,'PUT',{name,unitType});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không sửa được đơn vị');
   return;
  }
 }else{
  department.name=name;
  department.unit_type=unitType;
  teamCatalog.filter(team=>String(team.department_id||'')===String(id)).forEach(team=>{team.department=name;team.unit_type=unitType});
  saveLocalOrgData();
 }
 renderTeamManager();
 toast('Đã cập nhật đơn vị');
}
async function deleteDepartment(id){
 const department=departmentCatalog.find(item=>Number(item.id)===id);
 if(!department)return;
 if(!confirm(`Xóa đơn vị "${department.name}"?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/departments/${id}`,'DELETE',{});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được đơn vị');
   return;
  }
}else{
  if(teamCatalog.some(team=>String(team.department_id||'')===String(id))){
   toast('Không thể xóa đơn vị đang có đội/trạm trực thuộc');
   return;
  }
  const index=departmentCatalog.findIndex(item=>Number(item.id)===id);
  if(index>=0)departmentCatalog.splice(index,1);
  saveLocalOrgData();
 }
 renderTeamManager();
 toast('Đã xóa đơn vị');
}
async function addManagedTeam(){
 const input=$('#newTeamManagerName');
 const departmentId=Number($('#teamDepartmentSelect')?.value)||departmentCatalog[0]?.id;
 const name=input.value.trim();
 if(!name){toast('Vui lòng nhập tên đội');return}
 if(!departmentId){toast('Vui lòng tạo hoặc chọn đơn vị trước');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/teams','POST',{name,departmentId});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được đội');
   return;
  }
 }else{
  const department=departmentCatalog.find(item=>Number(item.id)===Number(departmentId));
  teams.push({name,staff:[]});
  teamCatalog.push({id:Date.now(),name,department_id:departmentId,department:department?.name||'',unit_type:department?.unit_type||'Cấp phòng',staff_count:0,asset_count:0});
  saveLocalOrgData();
 }
 input.value='';
 renderTeamManager();
 renderStaffDirectory();
 renderOrgTree();
 toast('Đã thêm đội');
}
async function editManagedTeam(id){
 const team=teamCatalog.find(item=>Number(item.id)===id);
 if(!team)return;
 const oldName=team.name;
 const value=prompt('Tên đội',team.name);
 if(value===null)return;
 const name=value.trim();
 if(!name){toast('Tên đội không được trống');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/teams/${id}`,'PUT',{name,departmentId:team.department_id});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không sửa được đội');
   return;
  }
}else{
  team.name=name;
  const localTeam=teams.find(item=>item.name===oldName);
  if(localTeam)localTeam.name=name;
  saveLocalOrgData();
 }
 renderTeamManager();
 renderStaffDirectory();
 renderOrgTree();
 toast('Đã cập nhật đội');
}
async function deleteManagedTeam(id){
 const team=teamCatalog.find(item=>Number(item.id)===id);
 if(!team)return;
 if(!confirm(`Xóa đội "${team.name}"?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/teams/${id}`,'DELETE',{});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được đội');
   return;
  }
}else{
  const teamIndex=teamCatalog.findIndex(item=>Number(item.id)===id);
  if(teamIndex>=0)teamCatalog.splice(teamIndex,1);
  const localIndex=teams.findIndex(item=>item.name===team.name);
  if(localIndex>=0)teams.splice(localIndex,1);
  saveLocalOrgData();
 }
 renderTeamManager();
 renderStaffDirectory();
 renderOrgTree();
 toast('Đã xóa đội');
}
function renderCatalogs(){
 renderCatalogList('positions','#positionCatalog');
 renderCatalogList('ranks','#rankCatalog');
 refreshIcons();
}
function renderCatalogList(type, selector){
 const container=$(selector);
 if(!container)return;
 const icon=type==='positions'?'briefcase-business':'badge';
 const label=type==='positions'?'Chức vụ':'Chức hàm';
 container.innerHTML=catalogs[type].map((value,index)=>`
  <div class="catalog-item">
   <label class="catalog-select" title="Chọn ${escapeHtml(value)}">
    <input type="checkbox" data-select-catalog="${type}" value="${escapeHtml(value)}" aria-label="Chọn ${escapeHtml(value)}"/>
   </label>
   <span class="catalog-item-icon"><i data-lucide="${icon}"></i></span>
   <div class="catalog-item-main">
    <span class="catalog-row-label">${label} ${String(index+1).padStart(2,'0')}</span>
    <input value="${escapeHtml(value)}" data-catalog-value="${type}" data-index="${index}" aria-label="${label} ${index+1}"/>
   </div>
   <div class="catalog-actions">
    <button class="mini-action" data-save-catalog="${type}" data-index="${index}" type="button" title="Lưu thay đổi" aria-label="Lưu ${escapeHtml(value)}"><i data-lucide="save"></i></button>
    <button class="mini-action danger-action" data-delete-catalog="${type}" data-index="${index}" type="button" title="Xóa danh mục" aria-label="Xóa ${escapeHtml(value)}"><i data-lucide="trash-2"></i></button>
   </div>
  </div>`).join('');
 $all(`[data-save-catalog="${type}"]`).forEach(button=>button.onclick=()=>saveCatalogItem(type,Number(button.dataset.index)));
 $all(`[data-delete-catalog="${type}"]`).forEach(button=>button.onclick=()=>deleteCatalogItem(type,Number(button.dataset.index)));
 bindBulkSelection(type==='positions'?'#deleteSelectedPositions':'#deleteSelectedRanks',`[data-select-catalog="${type}"]`);
}
async function addCatalogItem(type, inputSelector){
 const input=$(inputSelector);
 const value=input.value.trim();
 if(!value){toast('Vui lòng nhập tên danh mục');return}
 if(catalogs[type].some(item=>item.toLowerCase()===value.toLowerCase())){toast('Danh mục đã tồn tại');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/catalogs/${type}`,'POST',{name:value});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được danh mục');
   return;
  }
 }else{
  catalogs[type].push(value);
 }
 input.value='';
 refreshCatalogDependents();
 toast('Đã thêm danh mục');
}
async function saveCatalogItem(type, index){
 const input=$(`[data-catalog-value="${type}"][data-index="${index}"]`);
 const value=input.value.trim();
 if(!value){toast('Tên danh mục không được trống');renderCatalogs();return}
 if(catalogs[type].some((item,itemIndex)=>itemIndex!==index && item.toLowerCase()===value.toLowerCase())){toast('Danh mục đã tồn tại');renderCatalogs();return}
 const oldValue=catalogs[type][index];
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/catalogs/${type}/${encodeURIComponent(oldValue)}`,'PUT',{name:value});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không cập nhật được danh mục');
   renderCatalogs();
   return;
  }
 }else{
  catalogs[type][index]=value;
  syncCatalogValue(type,oldValue,value);
 }
 refreshCatalogDependents();
 toast('Đã cập nhật danh mục');
}
async function deleteCatalogItem(type, index){
 const oldValue=catalogs[type][index];
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/catalogs/${type}`,'DELETE',{names:[oldValue]});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được danh mục');
   return;
  }
 }else{
  catalogs[type].splice(index,1);
  syncCatalogValue(type,oldValue,'');
 }
 refreshCatalogDependents();
 toast('Đã xóa danh mục');
}
function syncCatalogValue(type, oldValue, newValue){
 const accountField=type==='positions'?'pos':'rank';
 const staffField=type==='positions'?'Chức vụ hiện tại':'Cấp bậc';
 accounts.forEach(account=>{if(account[accountField]===oldValue)account[accountField]=newValue});
 staffProfiles.forEach(profile=>{
  const work=profile.sections['Thông tin công tác']||{};
  if(work[staffField]===oldValue)work[staffField]=newValue;
 });
}
function refreshCatalogDependents(){
 renderCatalogs();
 renderUserCatalogOptions();
 renderAccounts();
 renderLogin();
 renderStaffDirectory();
 renderStaff(activeStaffTab);
}
async function deleteSelectedCatalogItems(type){
 if(!isAdminUser()){toast('Chỉ Admin được xóa dữ liệu');return}
 const values=$all(`[data-select-catalog="${type}"]:checked`).map(input=>input.value).filter(Boolean);
 if(!values.length){toast('Chưa chọn danh mục cần xóa');return}
 if(!confirm(`Xóa ${values.length} danh mục đã chọn?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/catalogs/${type}`,'DELETE',{names:values});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được danh mục');
   return;
  }
 }else{
  values.forEach(value=>{
   const index=catalogs[type].indexOf(value);
   if(index>=0)catalogs[type].splice(index,1);
  });
 }
 refreshCatalogDependents();
 toast('Đã xóa danh mục đã chọn');
}
function renderReports(){
 renderReportSummary();
 renderBarChart('#assetTypeChart',getAssetTypeStats());
 renderBarChart('#teamHandoverChart',getTeamHandoverStats());
 refreshIcons();
}
function renderReportSummary(){
 const container=$('#reportSummary');
 if(!container)return;
 const total=assets.length;
 const active=assets.filter(asset=>normalizeAssetStatus(asset.status)==='active').length;
 const maintenance=assets.filter(asset=>normalizeAssetStatus(asset.status)==='maintenance').length;
 const broken=assets.filter(asset=>normalizeAssetStatus(asset.status)==='broken').length;
 const assignedTeams=new Set(assets.map(asset=>asset.unit).filter(Boolean)).size;
 const cards=[
  ['boxes','Tổng thiết bị',total,'Tài sản đang quản lý','red'],
  ['check-circle','Đang sử dụng',active,`${total?Math.round((active/total)*100):0}% tổng số`,'green'],
  ['wrench','Bảo trì',maintenance,'Cần theo dõi xử lý','amber'],
  ['triangle-alert','Hư hỏng',broken,'Thiết bị cần thay thế/sửa','rose'],
  ['users-round','Đội đã bàn giao',assignedTeams,'Có tài sản đang gắn đội','teal']
 ];
 container.innerHTML=cards.map(([icon,label,value,note,tone])=>`
  <div class="report-kpi ${tone}">
   <span><i data-lucide="${icon}"></i></span>
   <div>
    <small>${escapeHtml(label)}</small>
    <strong>${value}</strong>
    <p>${escapeHtml(note)}</p>
   </div>
  </div>`).join('');
}
function getAssetTypeStats(){
 const labels=assetCategories.length ? assetCategories : ['PC','Màn hình','Bàn phím','Chuột','Xe máy','Flycam'];
 const stats=Object.fromEntries(labels.map(label=>[label,0]));
 assets.forEach(asset=>{
  if(stats[asset.type]!==undefined)stats[asset.type]++;
 });
 return Object.entries(stats).map(([label,value])=>({label,value}));
}
function getTeamHandoverStats(){
 const teamNames=[...new Set([...teams.map(team=>team.name),...assets.map(asset=>asset.unit).filter(Boolean)])];
 return teamNames.map(label=>({label,value:assets.filter(asset=>asset.unit===label).length}));
}
function renderBarChart(selector,data){
 const container=$(selector);
 if(!container)return;
 const max=Math.max(...data.map(item=>item.value),1);
 const total=data.reduce((sum,item)=>sum+item.value,0);
 container.innerHTML=data.map((item,index)=>`
  <div class="bar-column">
   <div class="bar-value"><span>${item.value}</span><span class="bar-percent">${total?Math.round((item.value/total)*100):0}%</span></div>
   <div class="bar-pillar" style="--bar-index:${index};height:${Math.max((item.value/max)*210, item.value?10:6)}px"></div>
   <div class="bar-label">${escapeHtml(item.label)}</div>
  </div>`).join('');
}
function normalizeAssetStatus(status){
 if(status==='Đang sử dụng' || status==='Hoạt động')return 'active';
 if(status==='Bảo trì' || status==='Tạm dừng')return 'maintenance';
 if(status==='Hư')return 'broken';
 return 'active';
}
function normalizeIdentity(value){
 return String(value||'').trim().toLocaleLowerCase('vi-VN');
}
function isAssetAssignedToCurrentUser(asset){
 if(isAdminUser())return true;
 if(!currentUser)return false;
 const profile=getStaffProfile(currentUser.u);
 const personalName=profile?.sections?.['Thông tin cá nhân']?.['Họ và tên'];
 const allowedNames=[currentUser.name,personalName,currentUser.u].map(normalizeIdentity).filter(Boolean);
 return allowedNames.includes(normalizeIdentity(asset.owner));
}
function getScopedAssets(){
 return isAdminUser()?assets:assets.filter(isAssetAssignedToCurrentUser);
}
function getScopedAssetCategories(){
 if(isAdminUser())return assetCategories;
 return [...new Set(getScopedAssets().map(asset=>asset.type).filter(Boolean))];
}
function getAssetCategoryIcon(category){
 const text=String(category||'').toLowerCase();
 if(text.includes('pc') || text.includes('máy tính'))return 'monitor-cog';
 if(text.includes('màn hình'))return 'monitor';
 if(text.includes('bàn phím'))return 'keyboard';
 if(text.includes('chuột'))return 'mouse-pointer-2';
 if(text.includes('xe máy'))return 'bike';
 if(text.includes('ô tô') || text.includes('xe ô'))return 'car';
 if(text.includes('flycam') || text.includes('flycame'))return 'drone';
 if(text.includes('di động') || text.includes('điện thoại'))return 'smartphone';
 if(text.includes('máy chiếu'))return 'presentation';
 return 'boxes';
}
function getAssetsByCategory(category){
 return getScopedAssets().filter(asset=>asset.type===category);
}
function focusAssetCategoryDetailIfStacked(){
 const layout=$('.asset-category-layout');
 const detail=$('#assetCategoryDetail');
 if(!layout || !detail)return;
 const columns=getComputedStyle(layout).gridTemplateColumns.split(' ').filter(Boolean).length;
 if(columns<2)detail.scrollIntoView({block:'start',behavior:'smooth'});
}
function renderAssetCategories(){
 const list=$('#assetCategoryList');
 if(!list)return;
 $('#assetCategoryManager')?.classList.toggle('asset-self-mode',!isAdminUser());
 const note=$('#assetCategoryManager .card-head .section-note');
 if(note)note.textContent=isAdminUser()
  ? 'Quản lý loại tài sản và theo dõi số lượng theo trạng thái.'
  : 'Chỉ hiển thị các loại tài sản có thiết bị đang bàn giao cho tài khoản này.';
 const visibleCategories=getScopedAssetCategories();
 if(!visibleCategories.includes(selectedAssetCategory))selectedAssetCategory=visibleCategories[0]||'';
 if(!visibleCategories.length){
  list.innerHTML='<div class="empty compact-empty"><div class="empty-icon"><i data-lucide="package-search"></i></div><h3>Chưa có tài sản bàn giao</h3><p>Module này chỉ hiển thị tài sản được bàn giao cho tài khoản đang đăng nhập.</p></div>';
  $('#assetCategoryDetail').innerHTML='<div class="empty compact-empty"><div class="empty-icon"><i data-lucide="package-search"></i></div><h3>Không có dữ liệu tài sản</h3><p>Chưa có tài sản nào được gán người quản lý là tài khoản này.</p></div>';
  refreshIcons();
  return;
 }
 list.innerHTML=visibleCategories.map((category,index)=>{
  const categoryAssets=getAssetsByCategory(category);
  const active=categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='active').length;
  const maintenance=categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='maintenance').length;
  const broken=categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='broken').length;
  return `<div class="asset-category-card ${category===selectedAssetCategory?'active':''}" data-asset-category="${escapeHtml(category)}">
   <div class="asset-category-head">
    <div class="asset-category-title">
     ${isAdminUser()?`<input type="checkbox" data-select-asset-category="${escapeHtml(category)}"/>`:'<span class="asset-category-lock"><i data-lucide="user-check"></i></span>'}
     <span class="asset-category-icon"><i data-lucide="${getAssetCategoryIcon(category)}"></i></span>
     <span><strong>${escapeHtml(category)}</strong><small>${categoryAssets.length} tài sản</small></span>
    </div>
    <span class="asset-category-count">${categoryAssets.length}</span>
   </div>
   <div class="asset-status-summary"><span class="ok-mini"><i data-lucide="check-circle"></i>${active}</span><span class="warn-mini"><i data-lucide="wrench"></i>${maintenance}</span><span class="lock-mini"><i data-lucide="triangle-alert"></i>${broken}</span></div>
   ${isAdminUser()?`<div class="asset-category-actions">
    <button class="mini-action" data-edit-category="${index}" title="Sửa loại tài sản" aria-label="Sửa ${escapeHtml(category)}"><i data-lucide="square-pen"></i></button>
    <button class="mini-action danger-action" data-delete-category="${index}" title="Xóa loại tài sản" aria-label="Xóa ${escapeHtml(category)}"><i data-lucide="trash-2"></i></button>
   </div>`:''}
  </div>`;
 }).join('');
 $all('[data-asset-category]').forEach(card=>card.onclick=e=>{if(e.target.closest('button,input'))return;selectedAssetCategory=card.dataset.assetCategory;selectedAssetStatus='all';renderAssetCategories();focusAssetCategoryDetailIfStacked()});
 $all('[data-edit-category]').forEach(button=>button.onclick=()=>editAssetCategory(Number(button.dataset.editCategory)));
 $all('[data-delete-category]').forEach(button=>button.onclick=()=>deleteAssetCategory(Number(button.dataset.deleteCategory)));
 bindBulkSelection('#deleteSelectedAssetCategories','[data-select-asset-category]');
 renderAssetCategoryDetail();
 refreshIcons();
}
async function deleteSelectedAssetCategories(){
 if(!isAdminUser()){toast('Chỉ Admin được xóa dữ liệu');return}
 const names=$all('[data-select-asset-category]:checked').map(input=>input.dataset.selectAssetCategory).filter(Boolean);
 if(!names.length){toast('Chưa chọn loại tài sản cần xóa');return}
 if(!confirm(`Xóa ${names.length} loại tài sản đã chọn?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/asset-categories','DELETE',{names});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được loại tài sản');
   return;
  }
 }else{
  const blocked=names.filter(name=>getAssetsByCategory(name).length);
  if(blocked.length){toast('Không thể xóa loại đang có tài sản');return}
  names.forEach(name=>{
   const index=assetCategories.indexOf(name);
   if(index>=0)assetCategories.splice(index,1);
  });
 }
 selectedAssetCategory=assetCategories[0]||'';
 renderAssetCategories();
 renderReports();
 toast('Đã xóa loại tài sản đã chọn');
}
function renderAssetCategoryDetail(){
 const detail=$('#assetCategoryDetail');
 if(!detail)return;
 const categoryAssets=getAssetsByCategory(selectedAssetCategory);
 const canManage=isAdminUser();
 const statuses=[
  ['all','Tất cả',categoryAssets.length],
  ['active','Hoạt động',categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='active').length],
  ['maintenance','Bảo trì',categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='maintenance').length],
  ['broken','Hư',categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)==='broken').length]
 ];
 const visibleAssets=selectedAssetStatus==='all'?categoryAssets:categoryAssets.filter(asset=>normalizeAssetStatus(asset.status)===selectedAssetStatus);
 detail.innerHTML=`
  <div class="card-head">
   <div>
   <h3><span class="detail-title-icon"><i data-lucide="${getAssetCategoryIcon(selectedAssetCategory)}"></i></span>${escapeHtml(selectedAssetCategory||'Chưa có loại tài sản')}</h3>
    <p class="section-note">${canManage?'Tổng số':'Tài sản bàn giao cho bạn'}: ${categoryAssets.length} tài sản</p>
   </div>
   ${canManage?'<button class="primary icon-button" id="addAssetInCategory" type="button"><i data-lucide="package-plus"></i>Thêm tài sản</button>':'<span class="scope-pill"><i data-lucide="user-check"></i>Phạm vi cá nhân</span>'}
  </div>
  <div class="status-tabs">${statuses.map(([key,label,count])=>`<button class="${selectedAssetStatus===key?'active':''}" data-asset-status="${key}">${label} (${count})</button>`).join('')}</div>
  ${canManage?`<form id="assetCategoryForm" class="form-grid hidden">
   <label>Mã tài sản<input name="id" required placeholder="VD: TB010"/></label>
   <label>Tên tài sản<input name="name" required placeholder="Tên tài sản"/></label>
   <label>Ngày nhận<input name="date" type="date"/></label>
   <label>Người quản lý<select name="owner">${renderOfficerOptions()}</select></label>
   <label>Đội/Đơn vị<input name="unit" placeholder="Đội/Đơn vị quản lý"/></label>
   <label>Trạng thái<select name="status"><option>Đang sử dụng</option><option>Bảo trì</option><option>Hư</option></select></label>
   <label>Nguyên giá<input name="value" placeholder="VD: 15000000"/></label>
   <label>Ghi chú<input name="note" placeholder="Ghi chú"/></label>
   <div class="actionbar"><button class="ghost icon-button" id="cancelAssetCategoryAdd" type="button"><i data-lucide="x"></i>Hủy</button><button class="primary icon-button" id="saveAssetCategoryAdd" type="submit"><i data-lucide="save"></i>Lưu tài sản</button></div>
  </form>`:''}
  <div class="table-wrap asset-detail-table">
   <table class="asset-category-table">
    <thead><tr><th>Mã TS</th><th>Tên tài sản</th><th>Người quản lý</th><th>Đội/Đơn vị</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${visibleAssets.map(asset=>`<tr><td><span class="asset-code">${escapeHtml(asset.id)}</span></td><td class="asset-name-cell">${escapeHtml(asset.name)}</td><td>${escapeHtml(asset.owner || '--')}</td><td>${escapeHtml(asset.unit || '--')}</td><td><span class="badge ${normalizeAssetStatus(asset.status)==='active'?'ok':normalizeAssetStatus(asset.status)==='maintenance'?'warn':'lock'}">${escapeHtml(asset.status)}</span></td><td><div class="table-mini-actions">${canManage?`<button class="mini-action" data-edit-category-asset="${escapeHtml(asset.id)}" title="Sửa tài sản" aria-label="Sửa tài sản ${escapeHtml(asset.id)}" type="button"><i data-lucide="square-pen"></i></button><button class="mini-action danger-action" data-delete-category-asset="${escapeHtml(asset.id)}" title="Xóa tài sản" aria-label="Xóa tài sản ${escapeHtml(asset.id)}" type="button"><i data-lucide="trash-2"></i></button>`:`<button class="mini-action" data-edit-category-asset="${escapeHtml(asset.id)}" title="Xem tài sản" aria-label="Xem tài sản ${escapeHtml(asset.id)}" type="button"><i data-lucide="eye"></i></button>`}</div></td></tr>`).join('') || '<tr><td colspan="6">Không có tài sản phù hợp.</td></tr>'}</tbody>
   </table>
 </div>`;
 $all('[data-asset-status]').forEach(button=>button.onclick=()=>{selectedAssetStatus=button.dataset.assetStatus;renderAssetCategoryDetail()});
 $all('[data-edit-category-asset]').forEach(button=>button.onclick=()=>openAssetModal(button.dataset.editCategoryAsset));
 $all('[data-delete-category-asset]').forEach(button=>button.onclick=()=>deleteAssetFromCategory(button.dataset.deleteCategoryAsset));
 if(canManage){
  $('#addAssetInCategory').onclick=()=>$('#assetCategoryForm').classList.remove('hidden');
  $('#cancelAssetCategoryAdd').onclick=()=>$('#assetCategoryForm').classList.add('hidden');
  $('#assetCategoryForm').onsubmit=saveAssetInCategory;
 }
 refreshIcons();
}
async function deleteAssetFromCategory(assetCode){
 if(!confirm(`Xóa tài sản "${assetCode}"?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/assets','DELETE',{assetCodes:[assetCode]});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được tài sản');
   return;
  }
 }else{
  const index=assets.findIndex(asset=>asset.id===assetCode);
  if(index>=0)assets.splice(index,1);
 }
 renderAssetCategories();
 renderAssetRows();
 renderTeamAssets();
 renderReports();
 toast('Đã xóa tài sản');
}
async function saveAssetInCategory(event){
 event.preventDefault();
 const form=$('#assetCategoryForm');
 const f=new FormData(form);
 const id=(f.get('id')||'').trim();
 const name=(f.get('name')||'').trim();
 if(!id || !name){toast('Vui lòng nhập mã và tên tài sản');return}
 if(assets.some(asset=>asset.id===id)){toast('Mã tài sản đã tồn tại');return}
 const next={
  id,
  name,
  type:selectedAssetCategory,
  date:fromDateInputValue(f.get('date')||''),
  owner:f.get('owner')||'',
  unit:f.get('unit')||'',
  status:f.get('status')||'Đang sử dụng',
  value:f.get('value')||'',
  note:f.get('note')||''
 };
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/assets','POST',next);
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được tài sản');
   return;
  }
 }else{
  assets.push(next);
 }
 form.reset();
 renderAssetCategories();
 renderAssetRows();
 renderTeamAssets();
 renderReports();
 toast('Đã thêm tài sản vào danh mục');
}
async function addAssetCategory(){
 const input=$('#newAssetCategoryName');
 const value=input.value.trim();
 if(!value){toast('Vui lòng nhập loại tài sản');return}
 if(assetCategories.some(category=>category.toLowerCase()===value.toLowerCase())){toast('Loại tài sản đã tồn tại');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/asset-categories','POST',{name:value});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được loại tài sản');
   return;
  }
 }else{
  assetCategories.push(value);
 }
 selectedAssetCategory=value;
 input.value='';
 renderAssetCategories();
 renderReports();
 toast('Đã thêm loại tài sản');
}
async function editAssetCategory(index){
 const oldValue=assetCategories[index];
 const value=prompt('Nhập tên loại tài sản mới',oldValue);
 if(value===null)return;
 const newValue=value.trim();
 if(!newValue){toast('Tên loại tài sản không được trống');return}
 if(assetCategories.some((category,categoryIndex)=>categoryIndex!==index && category.toLowerCase()===newValue.toLowerCase())){toast('Loại tài sản đã tồn tại');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/asset-categories/${encodeURIComponent(oldValue)}`,'PUT',{name:newValue});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không cập nhật được loại tài sản');
   return;
  }
 }else{
  assetCategories[index]=newValue;
  assets.forEach(asset=>{if(asset.type===oldValue)asset.type=newValue});
 }
 selectedAssetCategory=newValue;
 renderAssetCategories();
 renderAssetRows();
 renderReports();
 toast('Đã cập nhật loại tài sản');
}
async function deleteAssetCategory(index){
 const value=assetCategories[index];
 if(getAssetsByCategory(value).length){toast('Không thể xóa loại đang có tài sản');return}
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/asset-categories','DELETE',{names:[value]});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được loại tài sản');
   return;
  }
 }else{
  assetCategories.splice(index,1);
 }
 selectedAssetCategory=assetCategories[0]||'';
 renderAssetCategories();
 renderReports();
 toast('Đã xóa loại tài sản');
}

function switchAssetPanel(panelId){
 $all('#assetTabs .tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===panelId));
 $all('.asset-panel').forEach(p=>p.classList.toggle('active',p.id===panelId));
 if(panelId==='assetCheck')renderInventory();
}
function renderOrgTree(){
 const tree=$('#orgTree');
 if(!tree)return;
 recalculateOrgStats();
 if(!teamCatalog.some(team=>team.name===selectedTeam))selectedTeam=teamCatalog[0]?.name||'';
 tree.innerHTML=`
  <div class="org-root"><i data-lucide="landmark"></i> CÔNG AN TP. ĐỒNG NAI</div>
  <div class="org-dynamic-list">
   ${departmentCatalog.map(department=>{
    const relatedTeams=teamCatalog.filter(team=>String(team.department_id||'')===String(department.id));
    const teamLabel=getAssignmentName(department.unit_type);
    return `<div class="org-unit ${department.unit_type==='Cấp xã'?'commune':'room'}">
     <div class="org-room">
      <i data-lucide="${department.unit_type==='Cấp xã'?'map-pin-house':'building-2'}"></i>
      <span>${escapeHtml(department.name)}</span>
      <b>${relatedTeams.length} ${teamLabel}</b>
     </div>
     <div class="team-list">
      ${relatedTeams.map(team=>`<button class="team-node icon-button ${team.name===selectedTeam?'active':''}" data-team="${escapeHtml(team.name)}"><i data-lucide="${department.unit_type==='Cấp xã'?'map-pinned':'users-round'}"></i>${escapeHtml(team.name)}</button>`).join('') || `<p class="section-note">Chưa có ${teamLabel} trực thuộc.</p>`}
     </div>
    </div>`;
   }).join('')}
  </div>`;
 $all('[data-team]').forEach(button=>button.onclick=()=>{selectedTeam=button.dataset.team;renderOrgTree();renderTeamAssets()});
 renderTeamAssets();
 refreshIcons();
}
function renderTeamAssets(){
 const team=teamCatalog.find(item=>item.name===selectedTeam) || teamCatalog[0];
 if(!team)return;
 $('#teamAssetTitle').textContent='Cán bộ và tài sản đã bàn giao: '+team.name;
 const legacyTeam=teams.find(item=>item.name===team.name);
 const staffNames=[...new Set([
  ...accounts.filter(account=>account.u!=='admin' && account.team===team.name).map(account=>account.name),
  ...(legacyTeam?.staff||[])
 ].filter(Boolean))];
 if(!staffNames.length){
  $('#teamAssetList').innerHTML=`<p class="section-note">${getAssignmentName(team.unit_type)} này chưa có cán bộ được phân công.</p>`;
  return;
 }
 $('#teamAssetList').innerHTML=`<div class="handover-list">${staffNames.map(staffName=>{
  const staffAccount=accounts.find(account=>account.name===staffName);
  const handedAssets=assets.filter(asset=>asset.owner===staffName || asset.unit===team.name);
  return `<div class="handover-card">
   <strong>${escapeHtml(staffName)}</strong>
   <small><i data-lucide="building-2"></i>${escapeHtml(team.name)}</small>
   <small><i data-lucide="phone"></i>SĐT: ${escapeHtml(staffAccount?.phone || 'Chưa cập nhật')}</small>
   <div class="asset-chip-list">
    ${handedAssets.length?handedAssets.map(asset=>`<span class="asset-chip"><i data-lucide="package"></i>${escapeHtml(asset.id)} · ${escapeHtml(asset.name)}</span>`).join(''):'<span class="section-note">Chưa có tài sản bàn giao.</span>'}
   </div>
 </div>`;
 }).join('')}</div>`;
 refreshIcons();
}
function addTeam(){
 const input=$('#newTeamName');
 const name=input.value.trim();
 if(!name){toast('Vui lòng nhập tên đội');return}
 if(teams.some(team=>team.name.toLowerCase()===name.toLowerCase())){toast('Đội đã tồn tại');return}
 teams.push({name,staff:[]});
 selectedTeam=name;
 input.value='';
 renderOrgTree();
 toast('Đã thêm đội mới');
}
function renderAssets(){
 const visibleTabs=isAdminUser()
  ? assetTabs.map((label,i)=>({label,panel:assetPanels[i]}))
  : [{label:'Danh sách tài sản',panel:'assetList'}];
 $('#assetTabs').innerHTML=visibleTabs.map((tab,i)=>`<button class="tab ${i?'':'active'}" data-panel="${tab.panel}">${tab.label}</button>`).join('');
 $all('#assetTabs .tab').forEach(b=>b.onclick=()=>switchAssetPanel(b.dataset.panel));
 if(isAdminUser()){
  renderOrgTree();
  $('#switchAddAsset').classList.remove('hidden');
 }else{
  $('#switchAddAsset').classList.add('hidden');
 }
 renderAssetRows();
 renderAssetForm('#assetForm');
 renderInventory();
 switchAssetPanel(visibleTabs[0].panel);
}
function renderAssetRows(){
 const q=($('#assetSearch')?.value||'').toLowerCase();
 const typeFilter=$('#assetTypeFilter')?.value||'';
 const statusFilter=$('#assetStatusFilter')?.value||'';
 const ownerFilter=$('#assetOwnerFilter')?.value||'';
 const unitFilter=$('#assetUnitFilter')?.value||'';
 const visibleAssets=assets.filter(a=>{
  const belongsToUser=isAdminUser() || isAssetAssignedToCurrentUser(a);
  const textMatch=!q || JSON.stringify(a).toLowerCase().includes(q);
  const typeMatch=!typeFilter || a.type===typeFilter;
  const statusMatch=!statusFilter || a.status===statusFilter;
  const ownerMatch=!ownerFilter || a.owner===ownerFilter;
  const unitMatch=!unitFilter || a.unit===unitFilter;
  return belongsToUser && textMatch && typeMatch && statusMatch && ownerMatch && unitMatch;
 });
 populateAssetListFilters();
 $('#assetRows').innerHTML=visibleAssets.map(a=>`
 <tr>
  ${isAdminUser()?`<td><input type="checkbox" data-select-asset="${escapeHtml(a.id)}" aria-label="Chọn tài sản ${escapeHtml(a.id)}"/></td>`:''}
  <td>${escapeHtml(a.id)}</td><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.date)}</td><td>${escapeHtml(a.owner)}</td>
  <td><span class="badge ${a.status==='Đang sử dụng'?'ok':'warn'}">${escapeHtml(a.status)}</span></td>
  <td><button class="link-btn icon-button" data-edit-asset="${a.id}"><i data-lucide="eye"></i>${isAdminUser()?'Chi tiết / Sửa':'Xem chi tiết'}</button></td>
 </tr>`).join('') || `<tr><td colspan="${isAdminUser()?7:6}">Không có tài sản phù hợp.</td></tr>`;
 $all('[data-edit-asset]').forEach(b=>b.onclick=()=>openAssetModal(b.dataset.editAsset));
 const selectAll=$('#selectAllAssets');
 if(selectAll){
  selectAll.checked=false;
  selectAll.onchange=()=>{
   $all('[data-select-asset]').forEach(input=>input.checked=selectAll.checked);
   updateBulkDeleteButton('#deleteSelectedAssets','[data-select-asset]');
  };
 }
 bindBulkSelection('#deleteSelectedAssets','[data-select-asset]');
 refreshIcons();
}
function populateAssetListFilters(){
 const scopedAssets=getScopedAssets();
 const configs=[
  ['#assetTypeFilter','Tất cả chủng loại',asset=>asset.type],
  ['#assetStatusFilter','Tất cả trạng thái',asset=>asset.status],
  ['#assetOwnerFilter','Tất cả người quản lý',asset=>asset.owner],
  ['#assetUnitFilter','Tất cả đội/đơn vị',asset=>asset.unit]
 ];
 configs.forEach(([selector,label,getValue])=>{
  const select=$(selector);
  if(!select)return;
  const current=select.value;
  const values=[...new Set(scopedAssets.map(getValue).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
  select.innerHTML=`<option value="">${label}</option>`+values.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  select.value=values.includes(current)?current:'';
 });
}
function resetAssetFilters(){
 ['#assetSearch','#assetTypeFilter','#assetStatusFilter','#assetOwnerFilter','#assetUnitFilter'].forEach(selector=>{
  const input=$(selector);
  if(input)input.value='';
 });
 renderAssetRows();
}
function renderAssetForm(selector, asset={}){
 const fields=[
  ['id','Mã tài sản'],['name','Tên tài sản'],['type','Chủng loại'],['status','Hiện trạng'],
  ['value','Nguyên giá'],['date','Ngày nhận'],['unit','Đơn vị quản lý'],['owner','Người quản lý'],['note','Ghi chú']
 ];
 $(selector).innerHTML=fields.map(([key,label])=>{
  const value=asset[key]||'';
  if(key==='date')return `<label>${label}<input name="${key}" type="date" value="${escapeHtml(toDateInputValue(value))}"/></label>`;
  if(key==='status')return `<label>${label}<select name="${key}">${renderSelectOptions(assetStatusOptions,value,'Chọn hiện trạng')}</select></label>`;
  if(key==='type')return `<label>${label}<select name="${key}">${renderSelectOptions(assetCategories,value,'Chọn chủng loại')}</select></label>`;
  if(key==='owner')return `<label>${label}<select name="${key}">${renderOfficerOptions(value)}</select></label>`;
  return `<label>${label}<input name="${key}" placeholder="Nhập ${label.toLowerCase()}" value="${escapeHtml(value)}"/></label>`;
 }).join('');
}
function renderReadonlyAssetDetail(asset){
 const fields=[
  ['id','Mã tài sản'],['name','Tên tài sản'],['type','Chủng loại'],['status','Hiện trạng'],
  ['value','Nguyên giá'],['date','Ngày nhận'],['unit','Đơn vị quản lý'],['owner','Người quản lý'],['note','Ghi chú']
 ];
 $('#editAssetForm').innerHTML=`<div class="detail-grid readonly-detail">${fields.map(([key,label])=>`<div class="detail-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(asset[key]||'--')}</span></div>`).join('')}</div>`;
}
async function saveNewAsset(event){
 event.preventDefault();
 const form=$('#assetForm');
 const f=new FormData(form);
 const id=(f.get('id')||'').trim();
 if(!id){toast('Vui lòng nhập mã tài sản');return}
 if(assets.some(a=>a.id===id)){toast('Mã tài sản đã tồn tại');return}
 const next=Object.fromEntries(f.entries());
 next.date=fromDateInputValue(next.date);
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/assets','POST',next);
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không thêm được tài sản');
   return;
  }
 }else{
  assets.unshift(next);
 }
 form.reset();
 renderAssetRows();
 renderTeamAssets();
 renderReports();
 renderAssetCategories();
 switchAssetPanel('assetList');
 toast('Đã thêm tài sản mới');
}
function openAssetModal(assetId){
 editingAsset=assetId;
 const asset=assets.find(a=>a.id===assetId);
 if(!asset){toast('Không tìm thấy tài sản');return}
 if(!isAssetAssignedToCurrentUser(asset)){toast('Bạn không có quyền xem tài sản này');return}
 if(isAdminUser()){
  renderAssetForm('#editAssetForm',asset);
  $('#editAssetForm').elements.id.disabled=true;
  $('#updateAsset').classList.remove('hidden');
 }else{
  renderReadonlyAssetDetail(asset);
  $('#updateAsset').classList.add('hidden');
 }
 document.querySelector('#assetModal .modal-head h2').textContent=isAdminUser()?'Chỉnh sửa tài sản':'Chi tiết tài sản';
 $('#assetModal').classList.add('show');
}
async function updateAsset(){
 if(!isAdminUser()){toast('Bạn không có quyền sửa tài sản');return}
 const form=$('#editAssetForm');
 const f=new FormData(form);
 const asset=assets.find(a=>a.id===editingAsset);
 const next=Object.fromEntries(f.entries());
 next.date=fromDateInputValue(next.date);
 next.id=editingAsset;
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/assets/${encodeURIComponent(editingAsset)}`,'PUT',next);
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không cập nhật được tài sản');
   return;
  }
 }else if(asset){
  Object.assign(asset,next);
 }
 $('#assetModal').classList.remove('show');
 renderAssetRows();
 renderTeamAssets();
 renderReports();
 renderAssetCategories();
 toast('Đã cập nhật tài sản');
}
async function deleteSelectedAssets(){
 if(!isAdminUser()){toast('Chỉ Admin được xóa dữ liệu');return}
 const assetCodes=$all('[data-select-asset]:checked').map(input=>input.dataset.selectAsset).filter(Boolean);
 if(!assetCodes.length){toast('Chưa chọn tài sản cần xóa');return}
 if(!confirm(`Xóa ${assetCodes.length} tài sản đã chọn?`))return;
 if(location.protocol!=='file:'){
  try{
   await sendApi('/api/assets','DELETE',{assetCodes});
   await loadDataFromDatabase();
  }catch(error){
   toast(error.message || 'Không xóa được tài sản');
   return;
  }
 }else{
  assetCodes.forEach(assetCode=>{
   const index=assets.findIndex(asset=>asset.id===assetCode);
   if(index>=0)assets.splice(index,1);
  });
 }
 renderAssets();
 renderReports();
 renderAssetCategories();
 toast('Đã xóa tài sản đã chọn');
}

function normalizeInventorySession(session){
 return {
  id:String(session.id),
  name:session.name||'Đợt kiểm kê tài sản',
  date:formatApiDate(session.inventory_date||session.date),
  status:session.status||'Đang kiểm kê',
  note:session.note||'',
  createdBy:session.created_by||session.createdBy||'',
  total:Number(session.total_items||session.total||0),
  checked:Number(session.checked_items||session.checked||0),
  changed:Number(session.changed_items||session.changed||0)
 };
}
function normalizeInventoryItem(item){
 return {
  id:item.asset_code||item.id||'',
  name:item.name||'',
  type:item.category||item.type||'',
  owner:item.owner||'',
  unit:item.team||item.unit||'',
  expectedStatus:item.expected_status||item.expectedStatus||'Đang sử dụng',
  actualStatus:item.actual_status||item.actualStatus||item.expected_status||item.status||'Đang sử dụng',
  checked:Boolean(item.checked),
  note:item.note||''
 };
}
function getTodayInputValue(){
 return new Date().toISOString().slice(0,10);
}
function setInventoryDefaults(){
 const dateInput=$('#inventoryDate');
 const nameInput=$('#inventoryName');
 if(dateInput && !dateInput.value)dateInput.value=getTodayInputValue();
 if(nameInput && !nameInput.value){
  const date=new Date();
  nameInput.placeholder=`Kiểm kê tài sản ${date.toLocaleDateString('vi-VN')}`;
 }
}
function getSelectedInventory(){
 return inventorySessions.find(session=>session.id===String(selectedInventoryId));
}
async function refreshInventories(selectId=null){
 if(location.protocol==='file:'){
  renderInventory();
  return;
 }
 try{
  inventoryLoading=true;
  const rows=await fetchApi('/api/inventories');
  inventorySessions.splice(0,inventorySessions.length,...rows.map(normalizeInventorySession));
  if(selectId)selectedInventoryId=String(selectId);
  if(!selectedInventoryId || !inventorySessions.some(session=>session.id===String(selectedInventoryId))){
   selectedInventoryId=inventorySessions[0]?.id||null;
  }
  if(selectedInventoryId)await loadInventoryDetail(selectedInventoryId,true);
 }catch(error){
  toast(error.message || 'Không tải được dữ liệu kiểm kê');
 }finally{
  inventoryLoading=false;
  renderInventory();
 }
}
async function loadInventoryDetail(id,force=false){
 const sessionId=String(id);
 if(!sessionId)return;
 if(inventoryItemsBySession[sessionId] && !force)return;
 if(location.protocol==='file:'){
  inventoryItemsBySession[sessionId]=assets.map(asset=>normalizeInventoryItem({
   ...asset,
   asset_code:asset.id,
   category:asset.type,
   team:asset.unit,
   expected_status:asset.status,
   actual_status:asset.status,
   checked:false
  }));
  return;
 }
 const detail=await fetchApi(`/api/inventories/${encodeURIComponent(sessionId)}`);
 inventoryItemsBySession[sessionId]=(detail.items||[]).map(normalizeInventoryItem);
}
function selectInventory(id){
 selectedInventoryId=String(id);
 renderInventory();
 loadInventoryDetail(selectedInventoryId).then(renderInventory).catch(error=>toast(error.message || 'Không tải được chi tiết kiểm kê'));
}
function renderInventory(){
 setInventoryDefaults();
 const sessionsEl=$('#inventorySessions');
 const headEl=$('#inventoryDetailHead');
 const rowsEl=$('#inventoryRows');
 if(!sessionsEl || !headEl || !rowsEl)return;
 if(!inventorySessions.length && !selectedInventoryId && location.protocol==='file:'){
  inventorySessions.push({id:'demo-1',name:'Kiểm kê tài sản demo',date:new Date().toLocaleDateString('vi-VN'),status:'Đang kiểm kê',note:'Dữ liệu demo cục bộ',createdBy:'admin',total:assets.length,checked:0,changed:0});
  selectedInventoryId='demo-1';
 }
 if(!selectedInventoryId && inventorySessions[0])selectedInventoryId=inventorySessions[0].id;
 sessionsEl.innerHTML=inventorySessions.length?inventorySessions.map(session=>{
  const progress=session.total?Math.round((session.checked/session.total)*100):0;
  return `<button class="inventory-session ${session.id===String(selectedInventoryId)?'active':''}" data-inventory-id="${escapeHtml(session.id)}" type="button">
   <span class="inventory-session-title"><i data-lucide="clipboard-list"></i>${escapeHtml(session.name)}</span>
   <small>${escapeHtml(session.date||'--')} · ${escapeHtml(session.status)}</small>
   <span class="inventory-progress"><span style="width:${progress}%"></span></span>
   <span class="inventory-stats"><b>${session.checked}/${session.total}</b><em>${session.changed} lệch</em></span>
  </button>`;
 }).join(''):`<div class="inventory-empty"><i data-lucide="clipboard-check"></i><strong>Chưa có đợt kiểm kê</strong><span>Tạo đợt mới để bắt đầu đối chiếu tài sản.</span></div>`;
 $all('[data-inventory-id]').forEach(button=>button.onclick=()=>selectInventory(button.dataset.inventoryId));
 const session=getSelectedInventory();
 if(!session){
  headEl.innerHTML=`<div><h3>Chưa chọn đợt kiểm kê</h3><p class="section-note">Tạo hoặc chọn một đợt kiểm kê để xem danh sách tài sản.</p></div>`;
  rowsEl.innerHTML='<tr><td colspan="7">Chưa có dữ liệu kiểm kê.</td></tr>';
  refreshIcons();
  return;
 }
 const items=inventoryItemsBySession[String(session.id)];
 const progress=session.total?Math.round((session.checked/session.total)*100):0;
 headEl.innerHTML=`
  <div>
   <span class="section-chip"><i data-lucide="scan-line"></i>${escapeHtml(session.status)}</span>
   <h3>${escapeHtml(session.name)}</h3>
   <p class="section-note">${escapeHtml(session.date||'--')}${session.note?` · ${escapeHtml(session.note)}`:''}</p>
  </div>
  <div class="inventory-summary">
   <span><strong>${session.total}</strong><small>Tài sản</small></span>
   <span><strong>${session.checked}</strong><small>Đã kiểm</small></span>
   <span><strong>${session.changed}</strong><small>Sai lệch</small></span>
   <span><strong>${progress}%</strong><small>Tiến độ</small></span>
  </div>`;
 if(!items){
  rowsEl.innerHTML='<tr><td colspan="7">Đang tải chi tiết kiểm kê...</td></tr>';
  loadInventoryDetail(session.id).then(renderInventory).catch(error=>toast(error.message || 'Không tải được chi tiết kiểm kê'));
  refreshIcons();
  return;
 }
 rowsEl.innerHTML=items.length?items.map(item=>{
  const changed=item.checked && item.actualStatus!==item.expectedStatus;
  return `<tr class="${changed?'inventory-row-changed':''}">
   <td><span class="code-pill">${escapeHtml(item.id)}</span></td>
   <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.type||'--')} · ${escapeHtml(item.unit||'Chưa gán đơn vị')}</small></td>
   <td>${escapeHtml(item.owner||'--')}</td>
   <td><span class="badge ${item.expectedStatus==='Đang sử dụng'?'ok':'warn'}">${escapeHtml(item.expectedStatus)}</span></td>
   <td><select data-inventory-status="${escapeHtml(item.id)}">${assetStatusOptions.map(status=>`<option value="${escapeHtml(status)}" ${status===item.actualStatus?'selected':''}>${escapeHtml(status)}</option>`).join('')}</select></td>
   <td><input data-inventory-note="${escapeHtml(item.id)}" value="${escapeHtml(item.note)}" placeholder="Ghi chú kiểm kê"/></td>
   <td><button class="ghost icon-button" data-save-inventory-item="${escapeHtml(item.id)}" type="button"><i data-lucide="check-circle-2"></i>${item.checked?'Cập nhật':'Đã kiểm'}</button></td>
  </tr>`;
 }).join(''):'<tr><td colspan="7">Đợt kiểm kê chưa có tài sản.</td></tr>';
 $all('[data-save-inventory-item]').forEach(button=>button.onclick=()=>saveInventoryItem(button.dataset.saveInventoryItem));
 refreshIcons();
}
async function createInventory(){
 if(!isAdminUser()){toast('Chỉ Admin được tạo đợt kiểm kê');return}
 const name=$('#inventoryName')?.value.trim() || '';
 const inventoryDate=$('#inventoryDate')?.value || getTodayInputValue();
 const note=$('#inventoryNote')?.value.trim() || '';
 if(location.protocol!=='file:'){
  try{
   const result=await sendApi('/api/inventories','POST',{name,inventoryDate,note});
   $('#inventoryName').value='';
   $('#inventoryNote').value='';
   await refreshInventories(result.id);
  }catch(error){
   toast(error.message || 'Không tạo được đợt kiểm kê');
   return;
  }
 }else{
  const id=`demo-${Date.now()}`;
  const session={id,name:name||`Kiểm kê tài sản ${new Date().toLocaleDateString('vi-VN')}`,date:fromDateInputValue(inventoryDate),status:'Đang kiểm kê',note,createdBy:currentUser?.u||'admin',total:assets.length,checked:0,changed:0};
  inventorySessions.unshift(session);
  inventoryItemsBySession[id]=assets.map(asset=>normalizeInventoryItem({...asset,asset_code:asset.id,category:asset.type,team:asset.unit,expected_status:asset.status,actual_status:asset.status,checked:false}));
  selectedInventoryId=id;
  renderInventory();
 }
 toast('Đã tạo đợt kiểm kê');
}
async function saveInventoryItem(assetCode){
 const session=getSelectedInventory();
 if(!session || !assetCode)return;
 const status=$all('[data-inventory-status]').find(input=>input.dataset.inventoryStatus===assetCode)?.value || 'Đang sử dụng';
 const note=$all('[data-inventory-note]').find(input=>input.dataset.inventoryNote===assetCode)?.value || '';
 if(location.protocol!=='file:'){
  try{
   await sendApi(`/api/inventories/${encodeURIComponent(session.id)}/items/${encodeURIComponent(assetCode)}`,'PUT',{actualStatus:status,note,checked:true});
   await refreshInventories(session.id);
  }catch(error){
   toast(error.message || 'Không lưu được kiểm kê');
   return;
  }
 }else{
  const items=inventoryItemsBySession[String(session.id)]||[];
  const item=items.find(row=>row.id===assetCode);
  if(item){
   item.actualStatus=status;
   item.note=note;
   item.checked=true;
   session.checked=items.filter(row=>row.checked).length;
   session.changed=items.filter(row=>row.checked && row.actualStatus!==row.expectedStatus).length;
  }
  renderInventory();
 }
 toast('Đã lưu kiểm kê tài sản');
}

function getModuleLabel(key){
 return moduleDefinitions.find(module=>module.key===key)?.name || key || '--';
}
function formatActivityDate(value){
 if(!value)return '--';
 const date=new Date(value);
 if(Number.isNaN(date.getTime()))return String(value);
 return date.toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function getActivityQuery(){
 const params=new URLSearchParams();
 const fields=[
  ['#activityUserFilter','username'],
  ['#activityModuleFilter','moduleKey'],
  ['#activityActionFilter','action'],
  ['#activityDateFrom','dateFrom'],
  ['#activityDateTo','dateTo'],
  ['#activitySearch','q']
 ];
 fields.forEach(([selector,key])=>{
  const value=$(selector)?.value?.trim();
  if(value)params.set(key,value);
 });
 params.set('limit','500');
 return params;
}
async function loadActivityLogs(){
 if(!isAdminUser())return;
 activityLogLoading=true;
 try{
  const data=await fetchApi(`/api/activity-logs?${getActivityQuery().toString()}`);
  activityLogs.splice(0,activityLogs.length,...data);
 }catch(error){
  toast(error.message || 'Không tải được log lịch sử');
 }finally{
  activityLogLoading=false;
 }
}
async function renderActivityLogs(){
 const table=$('#activityLogRows');
 if(!table)return;
 if(!isAdminUser()){
  table.innerHTML='';
  return;
 }
 renderActivityFilters();
 if(!activityLogs.length && !activityLogLoading){
  await loadActivityLogs();
  renderActivityFilters();
 }
 $('#activityTotal').textContent=activityLogs.length;
 table.innerHTML=activityLogs.length ? activityLogs.map(log=>`
  <tr>
   <td><span class="log-time">${formatActivityDate(log.created_at)}</span></td>
   <td><span class="log-user"><i data-lucide="${log.actor_username==='admin'?'shield-check':'user-round'}"></i>${escapeHtml(log.actor_username)}</span></td>
   <td><span class="log-action">${escapeHtml(log.action)}</span></td>
   <td>${escapeHtml(log.module_name || getModuleLabel(log.module_key))}</td>
   <td>${escapeHtml(log.detail || '--')}</td>
   <td>${escapeHtml(log.ip_address || '--')}</td>
  </tr>`).join('') : `<tr><td colspan="6"><div class="empty compact-empty"><div class="empty-icon"><i data-lucide="history"></i></div><h3>Chưa có log phù hợp</h3><p>Thử đổi bộ lọc hoặc thực hiện một thao tác trong hệ thống.</p></div></td></tr>`;
 refreshIcons();
}
function renderActivityFilters(){
 const userFilter=$('#activityUserFilter');
 const moduleFilter=$('#activityModuleFilter');
 const actionFilter=$('#activityActionFilter');
 if(userFilter && userFilter.options.length<=1){
  userFilter.innerHTML='<option value="">Tất cả tài khoản</option>'+accounts.map(account=>`<option value="${escapeHtml(account.u)}">${escapeHtml(account.name)} (${escapeHtml(account.u)})</option>`).join('');
 }
 if(moduleFilter && moduleFilter.options.length<=1){
  moduleFilter.innerHTML='<option value="">Tất cả module</option>'+moduleDefinitions.filter(module=>module.key!=='staff').map(module=>`<option value="${escapeHtml(module.key)}">${escapeHtml(module.name)}</option>`).join('');
 }
 if(actionFilter){
  const current=actionFilter.value;
  const actions=[...new Set(activityLogs.map(log=>log.action).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
  actionFilter.innerHTML='<option value="">Tất cả hành động</option>'+actions.map(action=>`<option value="${escapeHtml(action)}">${escapeHtml(action)}</option>`).join('');
  actionFilter.value=current;
 }
}
async function refreshActivityLogs(){
 activityLogs.splice(0,activityLogs.length);
 await loadActivityLogs();
 renderActivityLogs();
}
function recordActivity(action,moduleKey,detail='',metadata={}){
 if(location.protocol==='file:' || !currentUser?.u)return;
 const module=moduleDefinitions.find(item=>item.key===moduleKey);
 fetch('/api/activity-logs',{
  method:'POST',
  keepalive:true,
  headers:{'Content-Type':'application/json','X-Actor':currentUser.u},
  body:JSON.stringify({
   actor:currentUser.u,
   action,
   moduleKey,
   moduleName:module?.name || (moduleKey==='login'?'Đăng nhập hệ thống':moduleKey),
   detail,
   metadata
  })
 }).catch(()=>{});
}
async function exportActivityLogs(){
 if(!isAdminUser()){toast('Chỉ Admin được xuất log lịch sử');return}
 recordActivity('Xuất file log','activityLog','Xuất log lịch sử thành file CSV');
 try{
  const response=await fetch('/api/activity-logs/export?actor=admin',{headers:{'X-Actor':currentUser.u}});
  if(!response.ok)throw new Error('Không xuất được file log');
  const blob=await response.blob();
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download='log-lich-su-ttttch.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Đã xuất file log lịch sử');
 }catch(error){
  toast(error.message || 'Không xuất được file log');
 }
}

async function fetchApi(path){
 const headers=currentUser?.u ? {'X-Actor':currentUser.u} : {};
 const response=await fetch(path,{headers});
 if(!response.ok)throw new Error(`API ${path} lỗi ${response.status}`);
 return response.json();
}
async function sendApi(path, method, body){
 const response=await fetch(path,{
  method,
  headers:{'Content-Type':'application/json',...(currentUser?.u?{'X-Actor':currentUser.u}:{})},
  body:JSON.stringify(body)
 });
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error || `API ${path} lỗi ${response.status}`);
 return data;
}
function formatApiDate(value){
 if(!value)return '';
 const date=new Date(value);
 if(Number.isNaN(date.getTime()))return String(value);
 return date.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function refreshTeamsFromData(apiTeams=[]){
 const teamNames=[...new Set([...apiTeams,...staffProfiles.map(profile=>profile.sections['Thông tin công tác']?.['Đơn vị công tác']).filter(Boolean),...assets.map(asset=>asset.unit).filter(Boolean)])];
 teams.splice(0,teams.length,...teamNames.map(name=>({
  name,
  staff:staffProfiles.filter(profile=>profile.sections['Thông tin công tác']?.['Đơn vị công tác']===name).map(profile=>profile.sections['Thông tin cá nhân']?.['Họ và tên']||accounts.find(account=>account.u===profile.username)?.name).filter(Boolean)
 })));
 if(!teams.some(team=>team.name===selectedTeam))selectedTeam=teams[0]?.name||'';
}
async function loadDataFromDatabase(){
 if(location.protocol==='file:')return false;
 try{
  const [apiAccounts,apiStaff,apiAssets,apiCategories,apiCatalogs,apiUserPerms,apiModules,apiPermissions,apiTeams,apiDepartments,apiInventories]=await Promise.all([
   fetchApi('/api/accounts'),
   fetchApi('/api/staff'),
   fetchApi('/api/assets'),
   fetchApi('/api/asset-categories'),
   fetchApi('/api/catalogs'),
   fetchApi('/api/user-permissions'),
   fetchApi('/api/modules'),
   fetchApi('/api/permissions'),
   fetchApi('/api/teams'),
   fetchApi('/api/departments'),
   fetchApi('/api/inventories')
  ]);
  rebuildModuleDefinitions(apiModules);
  perms.splice(0,perms.length,...apiPermissions.map(permission=>permission.name));
  Object.keys(permissionModuleMap).forEach(key=>delete permissionModuleMap[key]);
  apiPermissions.forEach(permission=>{
   if(permission.module_key)permissionModuleMap[permission.name]=permission.module_key;
  });
  accounts.splice(0,accounts.length,...apiAccounts.map(account=>({
   u:account.username,
   password:account.password||'123456',
   name:account.full_name,
   rank:account.rank||'',
   pos:account.position||'',
   team:account.team||'',
   phone:account.phone||'',
   status:account.status||'Hoạt động',
   role:account.role_name||account.position||'Cán bộ nghiệp vụ'
  })));
  assets.splice(0,assets.length,...apiAssets.map(asset=>({
   id:asset.asset_code||String(asset.id),
   name:asset.name||'',
   type:asset.category||'',
   date:formatApiDate(asset.received_date),
   owner:asset.owner||'',
   unit:asset.team||'',
   status:asset.status||'Đang sử dụng',
   value:asset.original_value ? String(asset.original_value) : '',
   note:asset.note||''
  })));
  assetCategories.splice(0,assetCategories.length,...apiCategories.map(category=>category.name));
  staffProfiles.splice(0,staffProfiles.length,...apiStaff.map(staff=>({
   username:staff.username,
   photo:staff.avatar_url||'',
   sections:{
    'Thông tin cá nhân':{
     'Họ và tên':staff.full_name||'',
     'Ngày sinh':formatApiDate(staff.birth_date),
     'Giới tính':staff.gender||'',
     'Dân tộc':staff.ethnicity||'',
     'Số CCCD':staff.citizen_id||'',
     'Ngày cấp CCCD':formatApiDate(staff.citizen_issued_date),
     'Nơi thường trú':staff.permanent_address||'',
     'Nơi ở hiện nay':staff.current_address||''
    },
    'Thông tin công tác':{
     'Đơn vị công tác':staff.team||'',
     'Chức vụ hiện tại':staff.position||'',
     'Cấp bậc':staff.rank||'',
     'Ngày vào ngành':formatApiDate(staff.joined_date),
     'Chuyên ngành đào tạo':staff.major||'',
     'Trình độ chuyên môn':staff.education_level||''
    },
    'Trình độ đào tạo':{
     'Trình độ học vấn':staff.education_level||'',
     'Trường đào tạo':staff.school_name||'',
     'Chuyên ngành':staff.major||'',
     'Năm tốt nghiệp':staff.graduation_year||'',
     'Loại hình đào tạo':staff.training_type||'',
     'Ngoại ngữ':staff.foreign_language||''
    },
    'Thông tin khác':{
     'Tình trạng hôn nhân':staff.marital_status||'',
     'Số điện thoại':staff.phone||'',
     'Email':staff.email||'',
     'Ghi chú':staff.note||''
    },
    'Tài liệu số hóa':{}
   }
  })));
  catalogs.positions.splice(0,catalogs.positions.length,...(apiCatalogs.positions||[]));
  catalogs.ranks.splice(0,catalogs.ranks.length,...(apiCatalogs.ranks||[]));
  Object.keys(accountPerms).forEach(key=>delete accountPerms[key]);
  Object.assign(accountPerms,apiUserPerms||{});
  departmentCatalog.splice(0,departmentCatalog.length,...(apiDepartments||[]));
  teamCatalog.splice(0,teamCatalog.length,...(apiTeams||[]));
  inventorySessions.splice(0,inventorySessions.length,...(apiInventories||[]).map(normalizeInventorySession));
  Object.keys(inventoryItemsBySession).forEach(key=>delete inventoryItemsBySession[key]);
  if(!selectedInventoryId || !inventorySessions.some(session=>session.id===String(selectedInventoryId))){
   selectedInventoryId=inventorySessions[0]?.id||null;
  }
  refreshTeamsFromData(apiCatalogs.teams||[]);
  if(!accounts.some(account=>account.u===selectedRole))selectedRole=accounts[0]?.u||'admin';
  if(!teams.some(team=>team.name===selectedStaffTeam))selectedStaffTeam=teams[0]?.name||'';
  if(!accounts.some(account=>account.u===selectedStaff))selectedStaff='';
  if(!assetCategories.includes(selectedAssetCategory))selectedAssetCategory=assetCategories[0]||'';
  return true;
 }catch(error){
  console.warn('Không tải được dữ liệu từ PostgreSQL, dùng dữ liệu demo tĩnh.',error);
  return false;
 }
}
function renderApp(){
 renderLogin();renderHeaderMeta();renderAccounts();renderRoles();renderStaff();renderAvatar();renderStaffDirectory();renderModuleSettings();renderTeamManager();renderCatalogs();renderAssets();renderReports();renderAssetCategories();renderSettings();renderActivityLogs();updateAdminVisibility();updateModuleVisibility();
}
async function initApp(){
 loadAppearanceSettings();
 const usingDatabase=await loadDataFromDatabase();
 if(!usingDatabase)loadLocalOrgData();
 renderApp();
 restoreLoginSession();
 if(usingDatabase)toast('Đã kết nối dữ liệu PostgreSQL');
}

$all('.nav-item').forEach(btn=>btn.onclick=()=>showPage(btn.dataset.page));
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-update-self-profile]');
 if(!button)return;
 event.preventDefault();
 openStaffUpdate();
});
$('#loginForm').onsubmit=login;
$('#togglePassword').onclick=togglePassword;
$('#toggleUserPassword').onclick=toggleUserPassword;
$('#logoutBtn').onclick=logout;
$('#accountSearch').oninput=renderAccounts;
$('#statusFilter').onchange=renderAccounts;
$('#downloadAccountTemplate').onclick=downloadAccountTemplate;
$('#importAccounts').onclick=openAccountImport;
$('#accountExcelInput').onchange=importAccountsFromExcel;
$('#deleteSelectedAccounts').onclick=deleteSelectedAccounts;
$('#openUserModal').onclick=()=>openUserModal();
$('#closeUserModal').onclick=$('#cancelUser').onclick=()=>$('#userModal').classList.remove('show');
$('#createUser').onclick=saveUser;
$('#newUserForm').username.oninput=event=>{event.target.value=sanitizeUsernameInput(event.target.value)};
$('#userUnitType').onchange=()=>renderUserCatalogOptions('');
$('#userDepartmentSelect').onchange=()=>renderUserCatalogOptions('');
$('#savePerm').onclick=savePerms;
$('#saveStaff').onclick=saveStaff;
$('#resetStaff').onclick=()=>loadStaffDataForCurrentUser();
$('#staffDirectorySearch').oninput=renderStaffDirectory;
$('#staffPositionFilter').onchange=renderStaffDirectory;
$('#staffRankFilter').onchange=renderStaffDirectory;
$('#staffTeamFilter').onchange=renderStaffDirectory;
$('#addModule').onclick=addModule;
$('#addPosition').onclick=()=>addCatalogItem('positions','#newPositionName');
$('#addRank').onclick=()=>addCatalogItem('ranks','#newRankName');
$('#deleteSelectedPositions').onclick=()=>deleteSelectedCatalogItems('positions');
$('#deleteSelectedRanks').onclick=()=>deleteSelectedCatalogItems('ranks');
$('#addDepartment').onclick=addDepartment;
$('#teamDepartmentSelect').onchange=renderTeamManager;
$('#addManagedTeam').onclick=addManagedTeam;
$('#addAssetCategory').onclick=addAssetCategory;
$('#deleteSelectedAssetCategories').onclick=deleteSelectedAssetCategories;
$('#uploadAvatar').onclick=uploadAvatar;
$('#avatarInput').onchange=handleAvatarFile;
$('#assetSearch').oninput=renderAssetRows;
$('#assetTypeFilter').onchange=renderAssetRows;
$('#assetStatusFilter').onchange=renderAssetRows;
$('#assetOwnerFilter').onchange=renderAssetRows;
$('#assetUnitFilter').onchange=renderAssetRows;
$('#resetAssetFilters').onclick=resetAssetFilters;
$('#deleteSelectedAssets').onclick=deleteSelectedAssets;
$('#switchAddAsset').onclick=()=>switchAssetPanel('assetAdd');
$('#saveAsset').onclick=saveNewAsset;
$('#resetAsset').onclick=e=>{e.preventDefault();$('#assetForm').reset()};
$('#downloadAssetTemplate').onclick=downloadAssetTemplate;
$('#importAssets').onclick=openAssetImport;
$('#assetExcelInput').onchange=importAssetsFromExcel;
$('#closeAssetModal').onclick=$('#cancelAssetEdit').onclick=()=>$('#assetModal').classList.remove('show');
$('#updateAsset').onclick=updateAsset;
$('#createInventory').onclick=createInventory;
['#activityUserFilter','#activityModuleFilter','#activityActionFilter','#activityDateFrom','#activityDateTo'].forEach(selector=>{
 const input=$(selector);
 if(input)input.onchange=refreshActivityLogs;
});
$('#activitySearch').oninput=()=>{clearTimeout(window.activitySearchTimer);window.activitySearchTimer=setTimeout(refreshActivityLogs,250)};
$('#refreshActivityLog').onclick=refreshActivityLogs;
$('#exportActivityLog').onclick=exportActivityLogs;

initApp();
