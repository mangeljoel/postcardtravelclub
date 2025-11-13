import AdminPages from "../src/features/AdminPages";
import UserReport from "../src/features/UserReport/UserReport";

const userReportPage = () => {
  return (
    <AdminPages
      isAdminOnly={true}
      childrenComponent={<UserReport type="userReport" />}
    />
  );
};
export default userReportPage;
