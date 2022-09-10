import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    value: {
      token: "1d8b1d7172084a77ce324240f4a58b89fe761433",
      id: 44806,
      first_name: "Ahmed",
      last_name: "",
      username: "ahmedhatem@Kayan.com",
      email: "",
      is_importing: false,
      country_code: "+20",
      phone: "10168989898",
      image:
        "https://sadakatcdn.cyparta.com/media/Users/ProfileLogo/Pngtreepink_watercolor_brushes_5054156_dOX6Bd4.JPEG",
      organization: {
        id: 6,
        name: "Kayan",
      },
      job_title: "juinpr",
      user_permissions: [
        {
          codename: "add_aqarchannel",
          name: "Can add aqar channel",
          name_ar: "اضافة قناة اعلانية",
        },
        {
          codename: "delete_aqarchannel",
          name: "Can delete aqar channel",
          name_ar: "حذف قناة اعلانية",
        },
        {
          codename: "view_aqarchannel",
          name: "Can view aqar channel",
          name_ar: "عرض قناة اعلانية",
        },
        {
          codename: "add_aqarclient",
          name: "Can add aqar client",
          name_ar: "اضافة عميل",
        },
        {
          codename: "change_aqarclient",
          name: "Can change aqar client",
          name_ar: "تعديل عميل",
        },
        {
          codename: "delete_aqarclient",
          name: "Can delete aqar client",
          name_ar: "حذف عميل",
        },
        {
          codename: "view_aqarclient",
          name: "Can view aqar client",
          name_ar: "عرض عميل",
        },
        {
          codename: "add_aqarclientcomment",
          name: "Can add aqar client comment",
          name_ar: "اضافة تعليقات علي العملاء",
        },
        {
          codename: "view_aqarclientcomment",
          name: "Can VIEW aqar client comment",
          name_ar: "عرض تعليقات علي العملاء",
        },
        {
          id: 113,
          name: "Can add aqar comment",
          codename: "add_aqarcomment",
        },
        {
          id: 115,
          name: "Can delete aqar comment",
          codename: "delete_aqarcomment",
        },
        {
          id: 116,
          name: "Can view aqar comment",
          codename: "view_aqarcomment",
        },
        {
          codename: "add_aqaremployee",
          name: "Can add aqar employee",
          name_ar: "اضافة الموظفين",
        },
        {
          codename: "aqarblock_employees",
          name: "Can block employees",
          name_ar: "حظر الموظفين",
        },
        {
          codename: "aqarexport_file",
          name: "Can export file",
          name_ar: "تصدير عملاء",
        },
        {
          codename: "aqarimport_file",
          name: "Can import file",
          name_ar: "استيراد عملاء",
        },
        {
          codename: "aqarstatistics",
          name: "Can see statistics of clients",
          name_ar: "عرض الاحصائيات",
        },
        {
          codename: "aqartransfer_clients",
          name: "Can transfer clients",
          name_ar: "نقل العملاء",
        },
        {
          codename: "change_aqaremployee",
          name: "Can change aqar employee",
          name_ar: "تعديل الموظفين",
        },
        {
          codename: "delete_aqaremployee",
          name: "Can delete aqar employee",
          name_ar: "حذف الموظفين",
        },
        {
          codename: "view_aqaremployee",
          name: "Can view aqar employee",
          name_ar: "عرض الموظفين",
        },
        {
          codename: "add_aqarevent",
          name: "Can add aqar event",
          name_ar: "اضافة الحالة",
        },
        {
          codename: "delete_aqarevent",
          name: "Can delete aqar event",
          name_ar: "حذف الحالة",
        },
        {
          codename: "view_aqarevent",
          name: "Can view aqar event",
          name_ar: "عرض الحالة",
        },
        {
          codename: "add_aqarimportexportfiels",
          name: "Can add aqar import export fiels",
          name_ar: "اضافة ملف",
        },
        {
          codename: "view_aqarimportexportfiels",
          name: "Can view aqar import export fiels",
          name_ar: "عرض الملف",
        },
        {
          codename: "add_aqarjob",
          name: "Can add aqar job",
          name_ar: "اضافة وظيفة",
        },
        {
          codename: "change_aqarjob",
          name: "Can change aqar job",
          name_ar: "تعديل وظيفة",
        },
        {
          codename: "delete_aqarjob",
          name: "Can delete aqar job",
          name_ar: "حذف وظيفة",
        },
        {
          codename: "view_aqarjob",
          name: "Can view aqar job",
          name_ar: "عرض الوظيفة",
        },
        {
          id: 97,
          name: "Can add aqar media",
          codename: "add_aqarmedia",
        },
        {
          id: 98,
          name: "Can change aqar media",
          codename: "change_aqarmedia",
        },
        {
          id: 99,
          name: "Can delete aqar media",
          codename: "delete_aqarmedia",
        },
        {
          id: 100,
          name: "Can view aqar media",
          codename: "view_aqarmedia",
        },
        {
          codename: "add_aqarpost",
          name: "Can add aqar post",
          name_ar: "اضافة منشورات",
        },
        {
          codename: "change_aqarpost",
          name: "Can change aqar post",
          name_ar: "تعديل المنشورات",
        },
        {
          codename: "delete_aqarpost",
          name: "Can delete aqar post",
          name_ar: "حذف المنشورات",
        },
        {
          codename: "view_aqarpost",
          name: "Can view aqar post",
          name_ar: "عرض المنشورات",
        },
        {
          codename: "add_aqarproject",
          name: "Can add aqar project",
          name_ar: "اضافة المشاريع",
        },
        {
          codename: "delete_aqarproject",
          name: "Can delete aqar project",
          name_ar: "حذف المشاريع",
        },
        {
          codename: "view_aqarproject",
          name: "Can view aqar project",
          name_ar: "عرض المشاريع",
        },
        {
          id: 89,
          name: "Can add aqar reaction on post",
          codename: "add_aqarreactiononpost",
        },
        {
          id: 91,
          name: "Can delete aqar reaction on post",
          codename: "delete_aqarreactiononpost",
        },
        {
          id: 92,
          name: "Can view aqar reaction on post",
          codename: "view_aqarreactiononpost",
        },
        {
          codename: "add_aqarunit",
          name: "Can add aqar unit",
          name_ar: "اضافة وحدة",
        },
        {
          codename: "change_aqarunit",
          name: "Can change aqar unit",
          name_ar: "تعديل وحدة",
        },
        {
          codename: "delete_aqarunit",
          name: "Can delete aqar unit",
          name_ar: "حذف وحدة",
        },
        {
          codename: "view_aqarunit",
          name: "Can view aqar unit",
          name_ar: "عرض وحدة",
        },
        {
          id: 85,
          name: "Can add aqar unit image",
          codename: "add_aqarunitimage",
        },
        {
          id: 86,
          name: "Can change aqar unit image",
          codename: "change_aqarunitimage",
        },
        {
          id: 88,
          name: "Can view aqar unit image",
          codename: "view_aqarunitimage",
        },
        {
          codename: "delete_historicalaqarclient",
          name: "Can delete historical aqar client",
          name_ar: "حذف سجل العملاء",
        },
        {
          codename: "view_historicalaqarclient",
          name: "Can view historical aqar client",
          name_ar: "عرض سجل العملاء",
        },
      ],
    },
  },
  reducers: {
    setToken: (state, action) => {
      state.value.token = action.payload;
    },
  },
});

export default userInfo.reducer;
