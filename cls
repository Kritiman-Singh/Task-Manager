[33m526cda0[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mUI-Dev[m[33m)[m Prepare backend for production deployment
 Task Manager Backend/.idea/vcs.xml                 |   6 [32m+[m
 Task Manager Backend/pom.xml                       |   6 [32m+[m
 .../JwtAuthenticationFilter.java                   |   2 [32m+[m[31m-[m
 .../src/main/resources/application-prod.yml        |  59 [32m+++[m
 .../src/main/resources/application.yaml            |   9 [32m+[m[31m-[m
 .../java/com/auth/AuthAppApplicationTests.java     |   2 [32m+[m
 .../auth/security/TaskSecurityIntegrationTest.java | 186 [32m+++++++++[m
 .../auth/services/DashboardServiceImplTest.java    |  92 [32m+++++[m
 .../auth/services/StatisticsServiceImplTest.java   | 122 [32m++++++[m
 .../com/auth/services/TaskServiceImplTest.java     | 199 [32m++++++++++[m
 .../auth/services/UserProfileServiceImplTest.java  | 151 [32m++++++++[m
 .../src/test/resources/application-test.yml        |  58 [32m+++[m
 .../target/auth-app-0.0.1-SNAPSHOT.jar             | Bin [31m0[m -> [32m70652085[m bytes
 .../target/auth-app-0.0.1-SNAPSHOT.jar.original    | Bin [31m0[m -> [32m143205[m bytes
 .../target/classes/application-prod.yml            |  59 [32m+++[m
 .../target/classes/application.yaml                |   9 [32m+[m[31m-[m
 .../classes/com/auth/AuthAppApplication.class      | Bin [31m3748[m -> [32m3811[m bytes
 .../authenticationConfig/AppConstants.class        | Bin [31m1067[m -> [32m1003[m bytes
 .../JwtAuthenticationFilter.class                  | Bin [31m7035[m -> [32m7068[m bytes
 .../OAuth2SuccessHandler.class                     | Bin [31m8564[m -> [32m8639[m bytes
 .../authenticationConfig/SecurityConfig.class      | Bin [31m13336[m -> [32m12603[m bytes
 .../controllers/AuthController.class               | Bin [31m15128[m -> [32m15167[m bytes
 .../controllers/UserController.class               | Bin [31m3912[m -> [32m3912[m bytes
 .../auth/authentication/entities/Provider.class    | Bin [31m1268[m -> [32m1292[m bytes
 .../RefreshToken$RefreshTokenBuilder.class         | Bin [31m3261[m -> [32m3261[m bytes
 .../authentication/entities/RefreshToken.class     | Bin [31m3735[m -> [32m3727[m bytes
 .../authentication/entities/Role$RoleBuilder.class | Bin [31m1837[m -> [32m1837[m bytes
 .../com/auth/authentication/entities/Role.class    | Bin [31m1667[m -> [32m1667[m bytes
 .../authentication/entities/User$UserBuilder.class | Bin [31m4196[m -> [32m4196[m bytes
 .../com/auth/authentication/entities/User.class    | Bin [31m7689[m -> [32m7692[m bytes
 .../auth/authentication/helpers/UserHelper.class   | Bin [31m532[m -> [32m532[m bytes
 .../auth/authentication/payload/LoginRequest.class | Bin [31m1446[m -> [32m1628[m bytes
 .../payload/RefreshTokenRequest.class              | Bin [31m1352[m -> [32m1521[m bytes
 .../com/auth/authentication/payload/RoleDto.class  | Bin [31m1100[m -> [32m1100[m bytes
 .../authentication/payload/TokenResponse.class     | Bin [31m2240[m -> [32m2483[m bytes
 .../com/auth/authentication/payload/UserDto.class  | Bin [31m4245[m -> [32m4241[m bytes
 .../repositories/RefreshTokenRepository.class      | Bin [31m583[m -> [32m583[m bytes
 .../repositories/RoleRepository.class              | Bin [31m639[m -> [32m639[m bytes
 .../repositories/UserRepository.class              | Bin [31m614[m -> [32m614[m bytes
 .../auth/authentication/services/AuthService.class | Bin [31m286[m -> [32m286[m bytes
 .../auth/authentication/services/UserService.class | Bin [31m766[m -> [32m766[m bytes
 .../services/impl/AuthServiceImpl.class            | Bin [31m1678[m -> [32m1678[m bytes
 .../services/impl/CookieService.class              | Bin [31m4217[m -> [32m4209[m bytes
 .../services/impl/CustomUserDetailService.class    | Bin [31m2210[m -> [32m2221[m bytes
 .../authentication/services/impl/JwtService.class  | Bin [31m6872[m -> [32m6860[m bytes
 .../services/impl/UserServiceImpl.class            | Bin [31m5897[m -> [32m5900[m bytes
 .../classes/com/auth/config/APIDocConfig.class     | Bin [31m1125[m -> [32m1125[m bytes
 .../classes/com/auth/config/ProjectConfig.class    | Bin [31m603[m -> [32m603[m bytes
 .../com/auth/controllers/AnalyticsController.class | Bin [31m2226[m -> [32m2226[m bytes
 .../com/auth/controllers/CalendarController.class  | Bin [31m1977[m -> [32m1977[m bytes
 .../com/auth/controllers/DashboardController.class | Bin [31m1556[m -> [32m1556[m bytes
 .../com/auth/controllers/TaskController.class      | Bin [31m7999[m -> [32m7999[m bytes
 .../controllers/TaskStatisticsController.class     | Bin [31m1987[m -> [32m1987[m bytes
 .../auth/controllers/UserProfileController.class   | Bin [31m2975[m -> [32m2975[m bytes
 .../target/classes/com/auth/dtos/ApiError.class    | Bin [31m2410[m -> [32m2630[m bytes
 .../auth/dtos/ApiResponse$ApiResponseBuilder.class | Bin [31m3920[m -> [32m3920[m bytes
 .../target/classes/com/auth/dtos/ApiResponse.class | Bin [31m8110[m -> [32m8098[m bytes
 .../classes/com/auth/dtos/ErrorResponse.class      | Bin [31m1599[m -> [32m1784[m bytes
 ...nalyticsResponse$AnalyticsResponseBuilder.class | Bin [31m3354[m -> [32m3354[m bytes
 .../auth/dtos/analytics/AnalyticsResponse.class    | Bin [31m6075[m -> [32m6067[m bytes
 ...darDayResponse$CalendarDayResponseBuilder.class | Bin [31m2540[m -> [32m2540[m bytes
 .../auth/dtos/calendar/CalendarDayResponse.class   | Bin [31m4017[m -> [32m4009[m bytes
 ...ashboardResponse$DashboardResponseBuilder.class | Bin [31m3306[m -> [32m3306[m bytes
 .../auth/dtos/dashboard/DashboardResponse.class    | Bin [31m5580[m -> [32m5572[m bytes
 .../DailyBreakdown$DailyBreakdownBuilder.class     | Bin [31m2409[m -> [32m2409[m bytes
 .../com/auth/dtos/stats/DailyBreakdown.class       | Bin [31m3885[m -> [32m3877[m bytes
 ...icsResponse$TaskStatisticsResponseBuilder.class | Bin [31m2823[m -> [32m2823[m bytes
 .../auth/dtos/stats/TaskStatisticsResponse.class   | Bin [31m4392[m -> [32m4384[m bytes
 ...askCreateRequest$TaskCreateRequestBuilder.class | Bin [31m3203[m -> [32m3203[m bytes
 .../com/auth/dtos/task/TaskCreateRequest.class     | Bin [31m6260[m -> [32m6252[m bytes
 .../task/TaskResponse$TaskResponseBuilder.class    | Bin [31m4412[m -> [32m4412[m bytes
 .../classes/com/auth/dtos/task/TaskResponse.class  | Bin [31m8713[m -> [32m8705[m bytes
 ...askSearchRequest$TaskSearchRequestBuilder.class | Bin [31m4298[m -> [32m4294[m bytes
 .../com/auth/dtos/task/TaskSearchRequest.class     | Bin [31m8005[m -> [32m7985[m bytes
 ...askUpdateRequest$TaskUpdateRequestBuilder.class | Bin [31m3203[m -> [32m3203[m bytes
 .../com/auth/dtos/task/TaskUpdateRequest.class     | Bin [31m6260[m -> [32m6252[m bytes
 ...swordRequest$ChangePasswordRequestBuilder.class | Bin [31m1836[m -> [32m1836[m bytes
 .../com/auth/dtos/user/ChangePasswordRequest.class | Bin [31m3320[m -> [32m3312[m bytes
 ...leRequest$UpdateUserProfileRequestBuilder.class | Bin [31m1846[m -> [32m1846[m bytes
 .../auth/dtos/user/UpdateUserProfileRequest.class  | Bin [31m3177[m -> [32m3169[m bytes
 ...rofileResponse$UserProfileResponseBuilder.class | Bin [31m2735[m -> [32m2735[m bytes
 .../com/auth/dtos/user/UserProfileResponse.class   | Bin [31m4641[m -> [32m4633[m bytes
 .../com/auth/entities/Task$TaskBuilder.class       | Bin [31m4948[m -> [32m4948[m bytes
 .../target/classes/com/auth/entities/Task.class    | Bin [31m6802[m -> [32m6778[m bytes
 .../classes/com/auth/enums/TaskPriority.class      | Bin [31m1141[m -> [32m1165[m bytes
 .../target/classes/com/auth/enums/TaskStatus.class | Bin [31m1083[m -> [32m1107[m bytes
 .../auth/exceptions/GlobalExceptionHandler.class   | Bin [31m6814[m -> [32m6851[m bytes
 .../exceptions/ResourceNotFoundException.class     | Bin [31m544[m -> [32m544[m bytes
 .../UnauthorizedResourceAccessException.class      | Bin [31m592[m -> [32m592[m bytes
 .../com/auth/repositories/TaskRepository.class     | Bin [31m3476[m -> [32m3476[m bytes
 .../specifications/TaskSpecification.class         | Bin [31m6104[m -> [32m6133[m bytes
 .../classes/com/auth/security/SecurityUtil.class   | Bin [31m1554[m -> [32m1546[m bytes
 .../com/auth/services/CalendarService.class        | Bin [31m348[m -> [32m348[m bytes
 .../classes/com/auth/services/TaskService.class    | Bin [31m1426[m -> [32m1426[m bytes
 .../com/auth/services/UserProfileService.class     | Bin [31m461[m -> [32m461[m bytes
 .../auth/services/impl/AnalyticsServiceImpl.class  | Bin [31m4037[m -> [32m4037[m bytes
 .../auth/services/impl/CalendarServiceImpl.class   | Bin [31m4162[m -> [32m4127[m bytes
 .../auth/services/impl/DashboardServiceImpl.class  | Bin [31m2963[m -> [32m2963[m bytes
 .../auth/services/impl/StatisticsServiceImpl.class | Bin [31m5919[m -> [32m5885[m bytes
 .../com/auth/services/impl/TaskServiceImpl.class   | Bin [31m13043[m -> [32m13060[m bytes
 .../services/impl/UserProfileServiceImpl.class     | Bin [31m5780[m -> [32m5817[m bytes
 .../target/maven-archiver/pom.properties           |   3 [32m+[m
 .../compile/default-compile/createdFiles.lst       |  36 [32m++[m
 .../default-testCompile/createdFiles.lst           |   6 [32m+[m
 .../testCompile/default-testCompile/inputFiles.lst |   6 [32m+[m
 .../target/test-classes/application-test.yml       |  58 [32m+++[m
 .../com/auth/AuthAppApplicationTests.class         | Bin [31m524[m -> [32m603[m bytes
 .../security/TaskSecurityIntegrationTest.class     | Bin [31m0[m -> [32m9144[m bytes
 .../auth/services/DashboardServiceImplTest.class   | Bin [31m0[m -> [32m5555[m bytes
 .../auth/services/StatisticsServiceImplTest.class  | Bin [31m0[m -> [32m7037[m bytes
 .../com/auth/services/TaskServiceImplTest.class    | Bin [31m0[m -> [32m10916[m bytes
 .../auth/services/UserProfileServiceImplTest.class | Bin [31m0[m -> [32m9864[m bytes
 Task Manager Frontend/index.html                   |   4 [32m+[m[31m-[m
 Task Manager Frontend/package-lock.json            |  75 [32m+[m[31m---[m
 Task Manager Frontend/package.json                 |   1 [32m+[m
 Task Manager Frontend/public/vite.svg              |   1 [31m-[m
 Task Manager Frontend/src/App.css                  |   0
 Task Manager Frontend/src/App.jsx                  |  35 [31m--[m
 Task Manager Frontend/src/App.tsx                  | 121 [31m------[m
 Task Manager Frontend/src/assets/hero.png          | Bin [31m13057[m -> [32m0[m bytes
 Task Manager Frontend/src/assets/react.svg         |   1 [31m-[m
 Task Manager Frontend/src/assets/vite.svg          |   1 [31m-[m
 Task Manager Frontend/src/components/auth/auth.js  |  64 [31m----[m
 Task Manager Frontend/src/components/ui/badge.jsx  |   1 [32m+[m
 Task Manager Frontend/src/components/ui/button.jsx |   1 [32m+[m
 Task Manager Frontend/src/components/ui/button.tsx |  67 [31m----[m
 Task Manager Frontend/src/lib/utils.ts             |   6 [31m-[m
 Task Manager Frontend/src/main.jsx                 |   1 [32m+[m
 Task Manager Frontend/src/main.tsx                 |  10 [31m-[m
 Task Manager Frontend/src/pages/auth.layout.jsx    |   1 [31m-[m
 .../src/pages/user/DashboardCmp.jsx                | 423 [31m---------------------[m
 .../src/pages/user/DashboardPage.jsx               |  18 [32m+[m[31m-[m
 Task Manager Frontend/src/pages/user/HomePage.jsx  |  14 [31m-[m
 .../src/pages/user/MyTasksPage.jsx                 |   2 [32m+[m[31m-[m
 .../src/pages/user/SettingsPage.jsx                |   2 [31m-[m
 .../src/pages/user/UserLayout.jsx                  |  22 [31m--[m
 Task Manager Frontend/src/utils/auth.js            |   4 [32m+[m[31m-[m
 137 files changed, 1091 insertions(+), 853 deletions(-)
