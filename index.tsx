import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Constants ---
const BG_KEY_VISUAL = "https://lh3.googleusercontent.com/pw/AP1GczPh0LK8jnyBi0TU8qmOCQnc7LUQYgMqwLrZ6wkHNg0i17o-8B_nlvHaoq9uNpK7JTXbuxyT9_kAJrFi_ygDANAIYZhsb3lCyrlvJHrHvFTrmxtBwEw06Iw3jz4C7ZDjZnCK_Ox9sDwpcd6m7l2fKp-x=w1000-h1000-s-no-gm?authuser=0";
const BG_HEADER = "https://lh3.googleusercontent.com/pw/AP1GczPh0LK8jnyBi0TU8qmOCQnc7LUQYgMqwLrZ6wkHNg0i17o-8B_nlvHaoq9uNpK7JTXbuxyT9_kAJrFi_ygDANAIYZhsb3lCyrlvJHrHvFTrmxtBwEw06Iw3jz4C7ZDjZnCK_Ox9sDwpcd6m7l2fKp-x=w878-h878-s-no-gm?authuser=0";
const BG_SCHEDULE_MAIN = "https://lh3.googleusercontent.com/pw/AP1GczO72lyTGDHjhrVv8oktAzTnJfi8oFLmwjJ6wH2PDcFnn06btWq_siNHcZopCv41xOx66YU1cZ8PCv1wcegFav52gxwrbwae4fppKkq6DtYAuxTrPQ0_FA5zd99e6UAqMkVFnTSeAHnwQTpLuDfV2Xks=w1920-h1080-s-no-gm";
const LOGO_DMD = "https://lh3.googleusercontent.com/pw/AP1GczOjFSLsdPBrjhqxldzh4MKaIzdqq846uaVwB1OZe2xwuzXh0pSZT45mvfLSJ3HRXaATIQnzHzL-7UG9ygJkK12RtOUDmDBRURymfLGkqr4Yq34uRoOwCcktV0DiChM-3vWJ0XkW_PnxZjNNmEqmo182=w1267-h878-s-no-gm?authuser=0";

const PARTNER_LOGOS = [
  "https://lh3.googleusercontent.com/pw/AP1GczP-4w3L1hW1L5TusrHdkv5K3cR2F--GG8_g4iNCY3PgNn_-LGcHSuWkeHK8UyesRiHUU1IXHCM3tbDfnaIbOysMVbYndlw2f1PlJwN21Sa8sO5I_IuEo_CYorrDS5Ai7MCJ4cSydqWm_KHxTrluP8xo=w1920-h581-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMoxBYkiHi36egVFncSJUasTUfJ43z4-pIVIF6166wacV0i1LFw_3ypkKVW1Q2O8lG_QON8X_LArAhVKJzGM8zK-xdKtbIenMOxk5znMHrfB70QU_EcfiLByMZvEYwJ-JZfOF0B3SdF--RrupyWfedq=w1920-h600-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPdTTgZdWkrdBWS8NwsnJZMXhEw_EAYl8s-OlhG2zPkM9jAaRx_-TfpOjOdRDW7MPN6tW5LO2aGzK24Dcjr30ILu6R2vGGrLK_6xfCfm-fHYupijFw-vpBELQ9HYYelsi4CyT6N72yt0vFh2gpUdmC9=w564-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOsJNhsE0UM_qSS5YWXMOFHeOGVdiC-gZxttVPMUZZE3Y4ovsV5ag2__ni8QjHVNxXH8L7gqBSj8-WRdOw0uaVIOLo9PgOmtGCc5TRL5Vp3r0seBqmqdBmKY4nS3WHl5JqrRIpgdHW_re3XrsWlpznV=w989-h260-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMdixS86ODzzLb-tojM_ROZuMJoFh2dQK0KdbP5Msc6NyKQfKrUYtvusmNG-BrgyCDVuu95OZiFm-25jJVdbQxUfKEuNDYH0f9o5bVOPhxRyuLQJz4yixQilgz8zJ985r4ITDhLqi-7Sc8qBuGyELzq=w338-h294-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOwt5u2Y5uMcdwKJ8ZQaVrtzxzRgdp7mgU9FjLRYDrRsdXEXkTKXzg6bB0QP0CAMgT9tVaXMXmYo86XR36cVJCKFJTVdpWNPv6Vm0tW5vk0KI6FPer_H1opCx4nqrTkg_oD8KL6j1uySx8Hcyg87rYA=w989-h257-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPej8uU-4uXrjhaf0QaELJ3ocCdNRf9gyk4ksjFNsGfO8XThiZd4t7pYEm1hQRmpLr4R4BbP2u6ueWFDX29juIDwFCPOpRcUt9BpRlVpEjtFYRvZCn91MjU8E_k-CV6Mv2caeS-dpx2Wc_e6hDPs3g8=w989-h495-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOILcNC8BoB4yFNECR3XyWmkrdBuZuqE_q3JgSt8vGXwG62HYem6OoZI4FBW_F64LIZdEoFwFM2-hS4lYV4HjXv-2yJ6dELw9rv_JOPZy-j4kGGk9UHH12ibB1vZcenoCOn-eWVW8utsVAcIcnvIn3W=w989-h158-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOZitpjKbrBtnM7Q0pKI4acc3UePqoi6HZo-fFRRWb9Lixalr6FeTq1lCn8v24dwNFzEaPQelW6l4LGRdnp9MPGRPzUN7NeIh-1vspLZb0HoOmuQIzyD-SjBxbgiedfxnw0nWD3QHd8RLMaBepJUjbe=w989-h449-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOGUibsoPhOiCUPwXh0tDGX9633x_CMNPpc-eDQuD0PdMkn-DX9KjbpTS4rjPobPv5vTWUT0osrHDq-nD7pDrrXQ6gKYqVuVXq1ijavk0BN90cz9sHMVzZguoheqphvgLp1vb_TnACO-ceJWtwu5ih0=w989-h203-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO0X0O7N0WU6Yb4zmCPqIsJGMTxoPRD8V8kOYRTcR4nAjtcLaLRMX6BJs1-pv1F-YjUDHL5evDX0vk1d0Uksw7uF3_6iq9L-Ytz2UALKx-7gvBAK3atR6Mxk6xXXjjsJ2ff3nhsmTjiqcsw97L7bxHR=w738-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNFdfGIXkya5sf69i6v__g4QOYV4bbsxQYjTFVlO_fj8CFEWkFIsGIR7FqroXI8oCOap_cFzMmy1K_27sM6-W8zutJsqjbdQxpByxRusbEicnAIe7PJex5m3R0fE4uZfGwl0OVpm4RT-8vN2XV5KsXZ=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPEMGhs0PnyS3iZ0Fz5TmBWkB0RjNzp_Eg9Ev12TRuVNcX0tBdTJPoGbmontd0YnMrO1TJ1doYwMS1IDFFlvWpJKPT-fsorEPzEzwA9lB8_alrlLuGQABObgMmOLscAEHuy0o7HvY7pvizuktYTxlix=w985-h363-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNaGuagPlqkgFSgv9AQFzxRwicftfdg2zGEY8CmR-zBkPAtqzU9fLmQF3VAsFf6IZVgUsGRRXQ3EMyuwuF89gI5bvLNnaEoX95IFPMx-J8Qc2GkakNkhyt_eeP6KnxXGWBibmiCgkiluqvyU4Cke78R=w989-h83-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPST46ZGjJeqyVW9sUyy12bu-vrcAQaNEMBE4cnulx2BB2LXDPJ0a2BL7ONElQGXxKiiluavTdEtPEM1pNRcImaCtFmG_kpiVZSUUCUXWJz0bd7oOzoBXR6R-GE-JE6y-aeM1iElURm8KhWYz4jYtv9=w808-h154-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO0t-tO61Huh4ezRJhcQ7qgnd4HGmyM14QSKlrMQDreK-Xs4-2gVb3hEWwu63WJjGZqBQP2ux2kHMstdbvL20CJGuH-uOEzC9V3RZ90UJPf6g0A4FIrdaCC7KnTce5aQPHrYiBWZHFpcDr_FWqX6u1r=w875-h504-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNLo8PaO4mCwaED-Q7-rswF0YAjz4S9bhVnHRjocf6B_Po-V2tzTA4ULPejmeW9HJjhtugR-wK0YUSNAPwA5_iARqvC6XpdZLQ-rl_7umz8hEL6roUVrJMNcaub-cDTfED6UEngqZrNKMG5V6hVjTK-=w989-h176-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMZTk3QnmdfV7QVcLjuPNEDu6npA-4k1Tw-zPEfXeqpGPTqHgwBxmWwmbaZUtqsuvqFSMtcQcq3fZFq701WwVBaGreFQ4-eRpJeVfV4Iz3MfMslIpo8Vwk8edV_8CyxZ5JTjvY7uu3KTMbIsbjie8AV=w989-h251-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMPpNq9FTq3kbdyMTuWloAVzuiNB5heWlraKPwPeknKXvgU5k1uiIALViBP2AB-rvl8DPWm-DBgJy6HTe7LI2tJXUtDmUzDoEmz7gemJsHak2CrK2RWR6lwBWTXOTSYNVZWhJogpt3Es2Yy6b7_-KXP=w989-h473-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMPotjpT8flxW573_6sZZ6AKjdoLaaHW_S76CMe8pb5JhDmkd_lCI3aNH6qgw23NogAJ50mFB4Xv7Evra1kHJ13y2WMZGpYJXHaPXPyjAE9b4E9cOiKtOKDAhFnzTh_3sVxbgzPhuI6Y4-oDORIJpK9=w989-h404-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPlR3fWg_chEvX3d4RZ1m9XCHNxN729KiHZANkW331WGb3rAQLATO28qpeeVFASiD7GA1pYs-zKqsmvGOqFd5Tw6UHpC3H6cibImwbq913COrgjs1Bu8WF4esu4-e2qX35yr14raeLB-SRjJc7DjYfd=w775-h821-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNFibWkVCh4j88nMcSaE4Qcz0LqbZryO4rBAFpoufEZL7-_kG67ycogChsU3tNsrPNiZtVF9IrtxcqnmvpMku74M3XEr_FlVTKTB6B39iPbb5HhXv7yMcSbnkz53cx7MXJsRmzu_3X2Nhw-WJezggL_=w835-h107-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO0ooVhiPqSJnctOuURzZaWPNOfVnJ51c1NenFN9nwFzGhC0vq_m0RLNfMieU4FzXS-weroN8vsCHOV2FeJtofzmxSXrjGFvpruGCqnGguSl8dMA0cXYjkXiXDo0sB_VxxNL_QIFxw34_bHWLgg-quZ=w989-h233-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO30VKQJkTk6gAsR7uK1MaAW5yJB_pP3fgZTPUsWCgd1Cs2T5UGsucXi-uRwQ5HCslrsqOw8r2x8wBZ1KmqCwwhqNSMufhlxFSLc_dvBiSoXQsAQARftSTCL7dXzGW-UGKBacTiGwpzKf6DO1XXMVfR=w800-h291-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPUN3CJqcOTcGdvPyWcNTgT5HnqF4iVg2pnIr7228LajL4DS6XzudzbyjcibM16fvTwGJVMKU__5OFHg8KAnI1vhno9KRqXiTvwLWE-AEx8FbaVzD3DodmtXKWq0uQQII51y1gr_JVHdOGKL8KmHhle=w800-h597-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPtGEzy3HFsC49prmO4mWCmge9OGDDzivWXCo2H76_BohdCxBtcEtFCtgM8NPH1gLtEVdKk2wS7ALRL-BnysYIt4Y5ofs4MVis4G8crY-BvSxsfMwbAVQe4RHrtWO4xtULJzfi_QkIwPH0q5RE61oEM=w382-h276-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMYmOuXolbKNgoW6WqfVrk1dwcnzZxywRWfqn6xb4Duxa97q3v2xcFI7gexDDP18yt_62f84160lQDhM-SSTuq-FQESCwHlSv3RlyFdfEujgVT3Bz0Su-gvcm5Ki5Dz3YS8BqAre0XONdAAdrH9EGgv=w989-h219-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNDKpr_xxOIm3IAqRjWMxcKZUsAN-kMPcrfr9Zjy4WT4b1QY6sd9J_VubhHqwdSAMxj1EVCw3qZvb1zUNjjpMUcTVDw43gaT9DmxDnBqiaxOXjmlU5d9MaWS0eVsN6ZPxvHLBVZ76AAA43x9Qs31NgG=w989-h392-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOzNrRiUTAjwQSthJg9RuaB6M8hxtr4pfGUlXt59Wx1NwgoP1Px7VPctlf-ZyJ6WZbIiDhjTaGb_M3yhbyLi97QdtRh9B548otqlbu3DT-jEClwJi0WxDKbNOVQUAE3QGUWBw0gqKhrec91YCCV2rWk=w989-h165-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOtT8kzTSTdlvzC1T8uKDZ34ukcpV0xcSpNTK-HjQcxGwoi2gZhgaWgoTd2_b9hgq8uHZcVrJjmF1eJ5XBW9hhVV6dhUtXzYl8CZHipNJwJim60-FJuEYZMn9Il6gXLHlQ-_4CmX3qmbVsgWejoVn_G=w989-h239-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM3HbFRSQbmnPuyS8sHHctc5JPTKijbBU-f18pbmFam3ECFrqzvyjqcgZP43TTJom07yU_uLQn-D43_793aCDXUKZp1xJJj9RbLSsaPT50LJKAisRBw5UdORk57W4x2-RUFNYmwLwRn-ZEBMLhOICBu=w989-h329-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMjDYFKP4Bct3I41dFjo6z8vu4G-UIswepgqrk1Txss-by0o8L_2qs5tH5UwYCZGzMi08hyZY2wDUaoG9Q7nWYIODTRNm5WjOXLJUnkvRRCchY8TuaepKt_8F7MdSANDgzQdP04l-n5mOOkYn1y4LWs=w948-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNo3fMtPF4Bf7yivUuCBhj4DKmf76dKvJ2MF6iyW32lD5KZBYcQ-rxl2v-8xicV0eoR-pGOyHZlMXjvn0Es_M2dTlUim4LvLnrvO8NRfKMHctRK6NuACXPsGALukqLEjn_n0Y4imUvO-ZTxCCjx1M0p=w828-h592-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNT_-0bo-pAMHt7di8RJousyY2kWlJn2FH05rkcs_WFXsxcHYHDytSiOxK0tCnaUVtZUwLwa-Ym08wzayVtRIu9O6HRLh2foeuzbysT4vNYhJaNARMBG8_2s9KNA257xN4FrgiGAjosZNMJ-bPg2Al7=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPwwj0_rM110j2fl49OQf7qoz-Qr5nzqZqcsxR7QmJ9YXu0QthD9e8beuBTTEJrabBSJEP8GXSYLqgqymSF8AhMJn60tUfcES_FuoeTmmquN0OtDu1OO83nNdfrxZ2FhKxzqNLl8IcXoDUMDgRFMMDV=w989-h291-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPYdTCWcrEq2IxqKc082auUhzNGQ0iQ9IBEqJ4pU8U4mwX_rSmgWVN5D-Gy6LOWzK6BEUpBit1o-tHxYdB4mkySiQOe6uGGdV-YdL2UGoYu-9XaEsAgL2uswc4L3HF6sn8nkX9ks8qSoUhEBAx-W3My=w946-h337-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN4yMLgHK1O--E-aQGzaQikv0QAyN5pZOC04sT2LVRGZGl5NyZvoPFy_HKI4bgvnip8-pT5JFKKoKVONwg1O-HNr3APG51yxi-Nqqf-4NcVBHq6Xk9xu_-hMH1Ad9J4mwd2fereYC7Imznw8hRz-RD3=w989-h374-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOhJdFg94GpoOrnh-eiwQIS2HhMrORT8CrWVYQXx9PeKHNYqWENTlv-DF7uGoxkl1SfiogPEOil9heA9qoYrYu2J-1Sy-FDO9aDK2ZPO_lJnSijdZhrNbOTc4jaWVkY8EGNCcNs8zlWC8FYG46OcqpW=w989-h353-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPtpovEQ1Cs3xby00S1F38bdUAUTTf1uzLDcUeVPPz2CAQw-UyN5eTDaZ1siDuhgC-uKjJsjzqP6hveWu1PHxaUo5ZMJZbhXp5wxAD9qrQZWrMEjIGLD1HTfmRLcM7d7-1yEomoDCN-sGAITR7CwSeN=w989-h848-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMaUkjzA86Q-tmB64rlCHjxvRPSixGLC1xpqkt6tcAt8UqqeA8x1CrVHwetxp1yTWuqc3jv3fmXA32OvV3_kENo-cocWUSJLAhmPZ_ThplIGuSsm9WpTSdceOuRArexHbudH_XUd24MW5-dBZvk6wup=w975-h176-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPLRNM5qLst3n5a7LJiQ95cfUnt36Yv0YW5Nvo_3kszSf-36fJZlvkq_EQ5UhnJp02Q_rsb2z_T1VdsjRTkpsZpvXW1hxgBDvCv7AncNjPwEHs3H3UUhv0BECkbwcOuyX9zoo-YPGiyiDzITEjDM6p-=w989-h126-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPlpWLEyR4cjt1MjvHNe4Ah1DyBlGRPGjNDMzAH-AM1d2apJmsmgNV5awPHl00IyBFofmSsLsSQvcI89P9HRRrhAURIqFsj9vIbWvuFSTn0e6vZyIkjsXjNG1HRg5au4-tT30kQ14RAyvSuImz04dDO=w989-h570-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNQhoHV2vnTk7uYUjwxd4e07xuckRUDIbht-xjQ7yLHd-cViK17iuEsiTFwFYYyyGN1m6fY4Z7dqFn5dZU_2y0iOY2a_llL4NTxWjJuYGuOIFBTARhjlYHKkBB_CDeQQxWsG43a0gyjBp-onFnaLiS0=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMHWRG8ZINu8UmRtrBKL_yU3JBCwCmsOBbCstJ-_kNYOr4UNDUT4iM8wTapS53CN3xk7hqmmC2GcucE9CH0KQXe8KQb0H7ca8lv2AT4o_78Lw4bJ7uTB-1XlwZRDXgG2L4uZI1CBOYzTSYdBBZ7Zt0G=w735-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO9crbVo5oD2ABLimjMXic4cjIxMDzoiRUVcpG4b0dEAX3SPiDyKtq9YbjYelDLXLnKKbfXTTIXGip7X_rsjrl-5dhtwV2kyOi99X0UXCIdie9_lsaxRskxz8ER5C-MzGpsS27iKgByZ3WoW6Xhz-bU=w989-h930-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNmXw3kcRRXLON0s4wQBnbmyPn31FuTV9Xnn8-z6-px6E1X1JgsMV_J3AUiRYxZ9bmJFlL7VivgUDan_7qOpF-7l05bwpaIZHhklxzgAu9IKuMR5Rl7qcj1evVyrO2llXQ6Aaby2JtIStcTDmEF5Pti=w989-h197-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOgEcaX0ubgfFhfLBfZ5qvaelF7NhXC2A4eG19Ds6AbSfTYCb2atdpBJXBxp2FRi3p8-BB0Ndu4fHp58KQ22DYGRNB0gH63VDEV_RK_mVtqPRXsckPzAdeje6TxTuPDUDnKC-jMre9GfiSX77VF6cCi=w989-h636-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO22_9inkDYNF7o5RvR3DvCMSTXd8Kfu7TH6Fpt0pgSqciOlBlMKey7s6ycvq1tFoQlSQR_mgARpZypDknIM2Ki_sCLb8QqtLlzNX4TzLF9Z7khox7SC_CH0TiVBndnJf2ED_FxCHd5J2mbokNBxkI9=w989-h257-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPtc83mL_GHlyAhlIKfWDPVNACxNN4-AOcIebdTz0ebWQhH1mP8gDUkQY5IHQhb-8QjGYR3kpLoZME1_Oa0J0XwDlGad-f9w5ytDXUEjO8RrSY73zVeGvBTajgIWTYHITnoWCUNToPdSNL6EnG5k-7k=w983-h349-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMKLcVzExFEI07IX465hLDgPxnknmdEBrElk54bZGnjrx_H4Al0t7Xueuv70C6CbgpOCQCvcNlYeitS_0pzcJeO7Jjg1C8vItXIoWe4i7zGZ5UJ7CvfRc5DcEOyLkwB4d3br2R2fFbD92oIaD9zGqDr=w989-h122-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNe3DgUmI-WXqmeL106Vx-auCj-9e50T9AJpeXPMXvm83IZ_RzDNuL-XVkodNA609cuNGCK1mRxSJKFRSxeWe-dKxw3H7BdhJ4wXv3b61i9wRCRKR9_w7X2A1dUNEgnGrZQVLcZuV825E9DHkvbgDL7=w888-h490-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczODR8lhs_7vh-p9Df_gvn2cRH8f-BdWO4eCDsqfShHwpVWsfSMlXd3Ba1cyPxuBZwpJJsG-_XC6v3bv1_sBcdUegQgiFNDpCVXjGcH7BNnLYq04ygIYw-AEcorrnZhbFR4hn7SezBk9MdrL-SaONtse=w989-h158-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNZ3b0Hsgk7IIs1cDPptcCPM5aVbv5qZHllB3tDyhGH-R0qI_3skhYujhrGL-4Wn2sx_g_qUi3VmOJt0_GChxcsmyFgnS_nvsDcJBydYw7PHjYZPDJnLZrc20wsIKAETsfmHkyX1N2eLtBHp9BWhRoX=w989-h854-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO0P8MjBjG45_LWlhh7gjZUcn5R2D-Y3UgoYp-_G32Pmg-qmhXQ4rCK2TP7uwhDyMnnWAkmAMyy4vXaAEZtut_ufBIOj2qTHZokZ1vE6ylZbVwOKXMQxVLMlHOdnVI1ZY16RR5W-BX5n9SmjVEBkV_u=w989-h375-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN_NV8emESImdoObBY0yvacLm1owPuP4FrK0Lr7g9Ncv_GJHwKhJjj8eNxvnTmrTKfGPHzcSOFWUj2ufosyxk-V-ucIjDLO8T_RMP7_f2nayk-Y2-V5gXPaXBw7ulfWayAaJIwSfznyusxCiaVdK9pR=w989-h180-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPV_NaGgiGZtcGGoaAZq694CsKNDLr5cZtWLQe4c2SzZJmgd7C3HG8jcsU7p7V25mcSKeoSsVCda4aifHX4J_P2jLYAFepiBh0nWg7yFxRA99S1vjsW0uxSU-Ltjh28BZjyAVDxSFp6jpqXZszEWg-C=w579-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMPRRepEQ_LZqVxJhUiMHvJFxt92ippRFsvV5NFSvgJZELwMnlJ7koWGdEa12T-7KSLO7j2bxIkzkPpvyu_vHcooZH2bxYe8SduIa4WvCgO1mBFJCM4_IIJR58-u0M-ua-p1JiX0W059clPM2F8yq0Q=w924-h736-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOuy0Qds-XTjnVKMxYVIybzzvdXeKiHpsF5NYYjwbez2WKamJImM_IThdkVC74BvJhQB50WY8khfOa6J8DOVub9w9eg4fhbcQRcntzmwL8XcR1Wt3n4FwtbP1pnkp1JiOLm1xHooVxl8nXa2qrlwGWx=w823-h335-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM1l72dxHWvto_13dIOgy4DVw4sXI9XSvtlNA9zMzeO0KXkt5b_vYM0kh09zHY1zKCS56xerA7Gq8wZEbz9owrOdvmbtTqzNvl8BXFqIt3bk9_hrNLKGdKp_b_6-V5nmYzK4DIyEN34FqxrtT5DENUr=w989-h297-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNqIkGjPh-616dJ6Mo1FuSpQlLYUehFpz6YYTyOAv6Dc04LE292Je1SzVS4SrAQyx1Tn-JUImF5hsWvgShc-1m0F3CapGPoTPYf_lzQfV0Ns9oUpc6nGLeT99zt3Hi_LFK62O6WAnBx3sCY0XvifHBy=w989-h327-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPZv27FxV9SXb1qfRzGAzzQIYwYss6y0jtrZpmOVK3uRZMwddsTnU9SYufwu4WamZDc-TXN54StZpyKtmAIQ10ak6yBmOYpZ6MLKdctADew-ARKHrL5KB8qtc5wo5wFUtXhHEqqSQ-Uz60bG2VT8oRN=w989-h453-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMY658C_3FsAWCJEEOKLOFxYnJymEDsngrk0E5-N1D1OR9MdT5hhfWxiBlcobRNaZQzU4l6_kgnzT7iPWOyz05rUI2FXxuzVIyQWz5JElCrgGUgSWUqLT72sLDhO2NX7NxwJ1G5vWjKHSbi0MYHX7ww=w989-h731-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN1chYK4yTuc-c89IEkewfgWmSmrYrbvcKxbjS3xQGmeVcJeLIrOZbny8dfl1FQZyVFpWare8dL2MxzfENDYHV28BiRPhtYP68VP72pe1jUJsvuDj5OQ2UgwDidq2pzxqbaVXY7-8uqL5-E_gZOQ-NR=w763-h633-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPPSMnX_gq0eBi1zfVvhinXfJjQ68kdRPw7eFHyWuB9k4fOa8cAJO952jsXMnGCvPc2L1xFdJO7hC0s2ZO-KpLCk7tz2AoC7FxGjTK9Hs5k6x8sfvbL9MEkmoe4Vp9NyISThrT1ESwvunX0JUnbD9dr=w989-h219-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMB1MDQgkHA9qBsqCkTBM7j0jAklvr4_1all6ariAuyLDxrEBV2NLgkBYIv5tg4gU_SXS-Br5IFbnk7eDVpDKpqaFPz7Zciv2QF7OmANJyWpsYM0wdbxEBrkdqucE1LgEU1ANn0nAWVKOzn9O8p2GHa=w890-h377-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOeCGhEpK2gDbC6vTP--cbVjSEK-Yv4QaMkmxumdMSdhsVSY3kmQtLlHfFgVM3U1Sd7_jC2oiMCrJTwSYo1jljzfh1DAv1eyVOcuonSmGOxTE9DSMSaNoZsIH5QOaHVYb9CIhSwE727VCBKPyOU23eM=w989-h942-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNQ5R76GvioK8l4GnOD_Y49iNAgMMztRRTeMQIQxJZk8j8VPUYh2_O73PCHZBccaiY00wmyPYYuX2Nx6qadWhz_L5as8-o1i_pNAkQBEdI-r8kFdA-p_TcdCt7AAYIIQ3lMh7F8bhEx5F3hJRTEz4db=w989-h209-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM11Kjaw2LwHdI7YbN-T3aTnJyauPicmIXYOvUaEaEE_tA6-ff4LS-Vj2j_UsdmrluX9UEIeRwrocL_aa3vKiuOtvtgioRFCBWYj_bkRTW0MN0k1hNEqqPbH4IRcOTAza80W-9m5JkKbfIeHK18hUWK=w989-h722-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM2bwCCPwuasGXUKn6isyZsi3mnZT0ultmyIT6Z-xcvDt7eNKU7KAfzd0IJpRGmNAs3LRT-71oPONz_ryLt3SIKz_lej9cMfu7KN2J2TuNLfcNE1prVkIvH2ONzQk740qKvsYvqvHeMvwzW9Tcsl4hz=w989-h608-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP2Hej0i5-Tn2weHjT9VQZ4doN1wwwKuX3JJcAICP5ier3Lm-Jjwpf5pRpEcX71iGJpfFHtbVfOEfgAWvvAhqgyRR8ZlDGDkKa6v-mnBnFVxBE1uNmIREzfqoOAMsxPEJQBML-kcX9QCPyBDToQ5rJX=w792-h206-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNXUKIXqnTQJUcmlhpA2YH2Vlcxu7k3IWU9qLbRlA7QlpCCZ4CL4m12PXlJSKylRfrixKhirbZIFLEjacpc_JKPdJOo06aYkSpEafSJn4Xq1OtwQ907OtqCtyYInxExytcYQrW842cyltNHW0aM5qNx=w615-h615-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOaVxPLbe2xBOZN0M9NojN1rS8dG5-U4J2DvQa4G8U75imFG0VlJ8S266YpIb8mtdB2WM02MmveWwbla6BW57xNjGAF6QnjUQw8INeuB521eVd8f8X9fpsu__48nNud4MzY6K3WUOzYFT5zMLzbULQ_=w744-h748-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOIwlx2w8ViF6jzia_ol2vn16IbsdJkEvL3NAVQO9sW0JjsvI-jrJRJgMdZp_cMITf5RORgB_F8SsdCCeR-EN8yJHxBS6KZPpyVhbenZFbNWbgRKgZc4nnED64I91QUdf82YSTtuVSozhUeER2bTFOm=w989-h588-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMgTjyV4Re8sBg6JnAqAizycLA7QrS9SrO-0CHzqpw40eUiL_BEoUufbscWFIXvimgrCYk7Jv9s6Husia9EUBJKrkICNSLvxeLPawDzLogQkz_ihzTJR2uHX0kfm0c60G7u13cPkLXGC29Zh3H4fpmg=w989-h342-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMLrR2iMqSfDiGPdaQXHCPXv0889jXli8-X3fHM_3BFb2_wDLj1OAFkoQxN9b-DJIIfoFlIsbqkjdwxI7GQlAvHV2s5Alo3KE5krM005pG7eMBO3DyPnFFNgxR2qKvHhohwbTeJkQ2EomogZrmAiJlI=w989-h200-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPYXf1U2rnbi5kQi8HsD-31t4kNPUGebS_xJ05rINb8hSh5ZVViYy5pzMFP2iN0wsmde1hwiuIQnMbjqY7axk7-kxOgwmENsV27CglN6YVeUpe_8x8md3nRLDCTqdO9p516N9jTv3vN0PgD8mNHLQRe=w989-h276-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNO5uX_ulmz7Jw_vFORrHCe-csEYcE_BVSSEnq7KqmL_oTiaoF9htbgf2vZV_PWqpfa8n7xe9-2PcZsK0N2fBeaXcoupiNDm9V0abvgeHLcAePghz49g2xfN_cwNj7QCAn_9lHihUmfIljoPD3h7jVV=w989-h254-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNLQvSodh0rSo07N4uQsIUOK1g4P2GfOGNc8AytPUjbJc52dGIthp_umhoIRwNxNq5qMGiYD6AEMmFqnFueZHfWj8dUI6WvaSSpquIYW2xgU7Qmni84wEKz-vV25tbWl8VSH2hj1TXlrc1KtobjBn_C=w989-h249-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPQuFe0uPXa52E0uXa8xmGae0FzmboW7xPfVbW5rKhXImqV__Dq8YniZWJRMvDEWUnbOmXqKoXM1MW3T47PbICn7gVqB1vrUUCCiMdLrrM_-MEi3twVge9P8HQadt4J77myuXQApTrdFvUuBhkIelfE=w650-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMFJZt56IoLvoGe56Tvc274IO2o-io-BdhPjNQXueUdxDknEzmu0eHpYawZ4o_Tkn2OOxrMIgVE-ZbkPONWhsKLJSh5DTHe2H_Gk82uEddri1gk4KmWT_lHaiwa_LKBUHeHnFUB1Kn-IoDR70W6kx1F=w989-h200-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPR60tshZapbvw6qzO4tzFSwcgXygu1U15jfKvj3fznEGjet78xvvUMzDfPrC6vrpUT4BXh9z99jbwGPGTGYkGGUt_WL4-Pk-efYpQnWwEooircNadxE0WFi6ikr2GpsDk3uBvV4GhIWs_bmVCubyrg=w989-h258-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN-xFn9_EoQYm8C-s4QDqx-MXOPNoXe7gRibd21c2U2QvevesEfP8qmow40wKGKfg-MewHswcR1m1b9bbou7vwNO0y8WBExC6cFOUHetPJ5Mt2-OnFu9oQP5evG6APhMsqOdV5DacyxSGon3_kYPod3=w989-h203-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMlIbC5209TLqAR90p-aEdM9pzi5dxhyyzfUILX8dXAHULvrwDPO8R7UwqGl0hcsvaLqXxZjlliWmqxXr0OSn_3fV7Vpun0f_vAGxYp95NEEAOAIFPCatACM6D-5OeZ5ijOSJPaf6x-7RKn80E8ccss=w989-h284-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPv4qBAAy6Zv5xYp-5fklzz-C6kQb4mlpySjVZOg0IKcT7YqsXO8arZGN-vSWuUvw0Le-0xK62yRVu4rgLkdFMvGsscMJVtuYEjv67_IQjzuzzMbki-kMEDKHlhRvG27zic-jIWNjisqsdTIhYwc80t=w752-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPv6srTmomW6G1vRbMNGqf_BJuNRcQ4O7ABy-uhKQjQDlYPlB3MjEiK_t9Ko3HYUGMsnhEJT2Z5x1vbsTiOUbVlpm4dgRdlaO7LJ2f0177CJWlTASHFwoorgYeWDRq09Ew4S1zbb1PnmKixOXWQtCR0=w768-h264-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM6UmA5UPjOOzs5zQ7-wFfYU2tk-4YQ38ClECob_uWy3xNrJCYwKW-yGmNgFIqlRzWq3rn5MockPRBylzWPPxfi2wm8SkRSGQ0cefH0Oef7wtMLa0k8kS4esKwja9R2MdR9EHTt_9HbK7CN9TFs6LXj=w989-h842-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM3gYSGDQ46jG7pomXf8inrWWCCrXjkFaSlR2YTjb8FVkbOR-ZOMzeNyGeDOJrxDTIjvy7j4R7RPquoG9etY6rC5Rt5LqluH9hhNSKAUMHy1TRvOP4HZqcOVJU4ENuBiZkFZ9TJwWxXIbUCS36ZdWSN=w348-h341-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOwZCua3GhgosDjWQyVq_Q8M1PMH35KXAHE_JItMUzjBa7lF4PsUGTm__MkBH-PqENtL9EejxCvwcAuS7AXg4IoHUOWGK6xY7KnV2vb1otDFWz7o6hlBCEjVnJ0P45Yrg-7pK3-Q6SZUgmS_jMJofEb=w989-h237-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN9s-ipqQlVGdfpuo_2T19xk4vhVdPE851Tse6W0mHmsxO17ZrWD-hfYLNc1thyoY8BMbg23YOIntjMvrmVnkkXtxJmWvbLEHmZ1yO0y7RfUVqaEVrYutrJnpGtv_QTc6APdlZ3apIiPDgrieAJPAY6=w989-h101-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMkprE7iKNj7R4VTYfIbC52AyZjEp0aplKmpX-YQ-uMzdRTYetw1q6q9-7aosQD3O-XwgpYszrz5JxfkI-W2I4hCFkCHU4KR0e0SRxeiJF4j2drVEf-QRm0AJtKgKapRng--l5AoBkXThTTs70v5jgC=w989-h425-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMPcPdUskq3v-elXx0qCPUXrWuMO7EDa361uZYKr0LbZh1x3YUoy4ni7kB55i7pLyoKmrwZyG8dp52ybsYSILTWSdccYVAsS6mEGCf_VTZ4SM3J7omezmaLZCDqIQZcWzOIkcGez5nwwLGxbVQpTAhI=w989-h552-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP_clt43GpcyIV_I4RetGQuX2Zi9BhfxKrnmO7XzbLBz0o_yRjtdUSz7wRY6Bp5oMzXQoAQP56YeRR3dZN_0jCaFs4XSAevGoYl4P6bg3g2zwJWz7pw5OjAfecYq4suahCR3HYYxEyXp9cC2c3g7r3i=w989-h624-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOyzYgg07LsVFHd9x9VeJpB7KLOJE9_JJZda8xHiueFvJk2pONFb9tF3SWuG-lkyW0Iqky4WumbGKGfZzv7DZ-UzfOsN_7HnfGCHafiClfP3fc9b1ppieAhR_nmLLYphfLqTe_gy3yGI3vGjNerQ1pC=w989-h105-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNvJJpQkzaiIiddEy8ODU0Y6eng7CUFyMFEZiyoS697w7Oe3YRzmpwrtlZxsmm3-JogqFy1-JAS_9Z_-St7Uudm19ybdrLvXdWXRgJbJa2U9HUFbs9jJzV7PM1PG_Ck1BjTnsYGK9aORTbOeWhyGkJH=w989-h161-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPdj4s9DilzJGUfCKbMRWdlPEyii8lIP55dSNLwoC90wwp6hIdz456apFKgWXHVzzafrC9IuGCusOJXfml1M2uWuUX9oFnMAOKZDTImiWZnvSg6evupGuQunGXotwf2MEIBWwpMMsw5yB33rdI37Hv2=w989-h783-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPu4ebdXWaFOTDIrJdR1OliJdQXNAl3LnNV6hoe0cjNTdCSCRwcJ5Jyua5XDjpvAHle1soIYmLPW7azexirYDjoL-INE_Ptv9El3Pyk9Aqsjdah_pd3aS4GZQabd3Wjiya9QFvxo_mG0zbKwPGgWWjO=w989-h417-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNaNE4DacBuJDZ33A9f4Pk5bIl30wJPcfEdhF9S2yqI6s8ynsqcgxv4v19TMe3eaMRByGIXX_xp68X8KRkVrynQj0zrS7kxjzeOmEjIrF8rQhD-Uea7MUGBYvfhHN7l6vwOrlsvkukcFMvL9EFrtd79=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN0SQtpu7mXPNNDiaiE4ReMqWqmQyOipXTOdNf2pS1D-fTmfr17pFklHSpOhWfSWIkXyYcJWAZdhIrrYOimBESMDWMIjoEhWtkflHP3OKXxk2N9u-TPBGgZUDGKaCNM3JW-hWY_BKhHC2s3kayrBlIC=w989-h552-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMbzJlhwa4W7lKKhp3fpsajXrujcTQpO_J4lM2thAvgZ2oxdwzZSCIKcMc2j3sqHPfcLkyvuusTR5ArEKCdBClirHj4DrWUkb48F5GN7xsfvZP1wPSHjw4wREmaEfiX5Trft_tNMEPHHLY5JXishE-o=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOEgWq1kQhu0Eq7khPy0WDoNd-Y4mz-YMNx881Ujrs4-21kUaiN5Sbri3N_YHmlCIe9jHrsA_90AhmQBnfMLfLRFHYxO2he2_XMpyVDIxbd2IOItEGinAQJv-vrq5LmwjWhb5Exhi1HWYfd1MWZy7aL=w989-h155-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO8OGZYoxR0VvnlmUytqtbSWz1aLfXd6J3qX6eYqUl32ZvidGoScbYeLmgTuD8J7xdNKXpz3wJ25tRZldPSYK67f0fE98Mz-Ypuvnq6HIzFxVNITXvIR0cYMpahS-BbTqq_pDxNm0OihXnZxSyr6ohj=w989-h495-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOjkzFSJ2Zuz13kSutZ6vArY-urd5dcMEumu9QPi2s1my7sj0flaPRxfBURAD3l2VNBI9aMNVeq00UzOYOsfhFZzise-naOoes9WSDHdMzPJSg-a2jX4hzAi2OlKn0ph7dJj0igF9SoL7neQ5khctez=w674-h674-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNi4QEPnaQ39FcGykYv2hr_ieCArHX8Y2k_6cpzb63ZhoCOZ-C0iAy6bo-bNa3sgrUUXVbdqTLPCtsXEfxqWqn9xjr-DfRlwgbi7xs12D5G80Pm31AckpftasyD9HgBc1TUKo88G1qZcqd59H2RhohC=w989-h348-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMjnJPgiuTKm9DLgDYnWODg42gy8cy6Pqx33DldXtQmykK9-JcoCRcZ_sSWj04wYu2fZVLLrXhS0eiRbFqgQQlgPPiw0yyyUVanISItepJHIz4bgiapQ7S-gMpmjw8B1EdFpfGmb15yAHJJhBW0Y1Rj=w989-h293-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN4RJistwUvWrvSthOGYxcppYrhx6U5uw1tIm9kVk_9Z2qo_KVMOgsRuH0v5j6Dwgy-tawK358DAhpmj57z78k_pCWen0dkrnJ8HHDd1B9SWHyH4LMJAUWNZeuwGJhXARwpQQ0mAVjeFMa7ctgKsvJb=w989-h750-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMZnvd-U3K2st0GKxTMkSlyxHKBN9zQZBLHbWrM7ePBaYwvleUHfEdB5ifPksGXJOO--n95hqPpcDwPhiv0fGtWoqLQmlRjt03lrRkE5iSlFayj7djTXfUIrn8ZWPSrlATR0uCzka0310IumWGotKyC=w800-h200-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO5bF_ZOLkixsJSm1qwCKT2AaMsCHwEULvnBcVqtqvxKjBqGG0CP1bI7DMzhiRB7yvCW3oC-JU-smMjISnc91ZoVmpd7wo5ppo6f-9wiWJkuRugtkJ60M8n2_R3TuXOYUWDInqc4kilZ2Ndlk0n94Hw=w989-h267-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMiOOXDRF9gOyPIsRfj4pZLxCvOBQkr-vYgnYepHVVPvOhKZp4cP7eiyBxspobXrIWglyV-0vjsw2DqNosAH7Qdyoh4FRYmNQc_DWCMv0s4Oi7L0vYbnyjggIrIYQV9zftmuix59tPsgPFqGBHKaso0=w989-h293-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMTe-mzz5Vn0YPJQmMMqJJd8nRj9fCsBiedambRPhaRG8I6VXkOMKlDWOZDczEp6EDHqNctJiVjW9jQQ5cZpXz5xBSQbUOfMzJ-XnRnj5cnPgett85gk3EL5xNBUTGT3dXD2yLa6OZpoPViNmYSiJuK=w989-h552-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOEweNAPi_Ioquz29YQ-Y7K5GYxrNhP9yYORSAz48sX-S-DWSCLCQz9cOqCm6Wf5XbMSZr9uAhg0nD3OEoNkgS1TzkSdNjh_soNCXOVuy22IU_Be1XyhsnZFrN8jdEtBeqFNnhkIV57K6QDn2ZMis9S=w989-h479-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNzCPhsMeg3Xw3lrPqwN7KMNm8LUPYl2WzLd3PeejSaRihz3Xwqu5DZAwS7V3tVI64y2UI0Ej3ilyoC4KKP95SswoCG91M1607JmHmB-v_bbK98i55ynZvKC58w3kLEA8UMPKGJVcWh9wQMyzQzRY9P=w989-h368-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNUbX9hhvKqvwRh1XSjqJ7ENYy6Iyua1P-IY0V0wY7Nl_DbNHibFtc4_B3Bbt30MewVXSzcFzK48MSfoa81hPi4er2qZF8dXLsE-XTZs5wybwhXBW-uJoTU3UmV8cLbu4vjxRnQakoFv3rSoSTS8zI3=w989-h552-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNThBWs1eV5o99BUSdbKts6lE5BLamWgZ_csX1aPBmitzt9eV7wtZE0JPbC_BWsZsJ-OM3u4wTC5UvBC5P-UlYivYhscK-b1FBZKv9NTlKw_qWV7KB8_Rl5i6vZaL7gOkOOg5qb8GJHaf4pGb6Gapy8=w989-h380-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMy1l2T4P0JuqiwdGwzN2mBtdvUTvWu_YUkXdYVAv3M2_hx2DEnqa0PDqLnQcgQCezBChBl9pf4_mmjujEna7Zi5up4be6jjIieTSGMDtz9QPQhSrqJ8s7O_luoPFNAqVW_m8joOG-j7vFvZMB-HNwG=w989-h596-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMFB2v3CB15X6ALgSiSG19mVSn7PjJ5mQ1yrUzutyYNZDRkmswR6XIgNsDl887hHooor12YiL4lf5jG6Y1lk8jgdkJuXWR2YYTfT_Pl0d9CVHNikIX4ChEbUTO8hv0AHMJDvikJwKlPz_JLkydUDMEl=w989-h330-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPZZCNZjEDIfZ89Q3KfS4cY4S9V6-nHUm1c-zJTx80-YEd8--YaHhoYhykhE_SuzTYC5sTmZke7c1fuY2jWn6gfs4bKGNNZr54QL4QPG6E0-yLFWmQ2fr0gGx8ofOYwrVnSd_izToDU7z1M5jLGYt6T=w851-h361-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPFvse2bJcWjC0P83kQKAA25u3kJd0TpoZTL39-wmO33o-Ld3Dr1ihnmJo0fQfIZNMO0TLz6nIN0Pvdl-gPshMQXKN7qmgSq7cgdRYMuJCW-28KT6X9f7DzE0vmIdlY33Jr1z9pVg7I2PasOgg-M-1v=w989-h822-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPuJIAHYf9VZhLi-bZBfMZfB2_JHd5ofIc7I6Lr4aEfoE9gmiVleomvlJXJeoo5pHqBDhitBKIzHZZO1MHPfUQOjqLbXXuIH3qhzn0mIz-_rbyFfVY_9Qgz1IWP2BpC25cWVbNEDUfa0qoHyX1iGAXl=w989-h257-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPb-HqYp7gTA66ldemWfVaKBNc9odaGK4yx-2xBAlbAqUz5Hnf_1w6VlciS1jc2xYNF0p9EHsCTEAA1ik4AJIlDYlhtQN0CQ4J1YKIjuqSA3-8Z1LD5f1E89r3NDELZSnUnAeMX1jR8Gkk2gC_W4vEm=w989-h305-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPpPjETzcuK3Y8HzvL8qQx00Jtz4uOs6znpjJmty4VQm5X2yM17Vx5jokutu4DBZ5rFrvGKnrd2huPrI7rhustGl-VO68XlFE2PBUJzXYRBiY2P18WiwWlFc-bJV8i0oe7e6zlWY3v0fpHg9MOZTuTb=w989-h479-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP-7Np_DugWa8LjKH-NyG3gy9pewH-UR2DIZMBaOfmNBjBQu0uLVkOQb2N1nmZMOrzKrsaqA4Dq_91LYEoONWaoMhXj_PLKBTZxrDAUZWCIxpMVqepNvk1lEHYO4gYzM24BWT0fqXk13F9Q98bUFmRz=w989-h135-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPyd_hSDqfEbgoGvKtbSL07moRk79Wd_lagjgYkYHUuenRmaIyDe0cH1QXxoo3DAn8an8Lu16AYlB3XNtGT1vxiJ0YlYD2WBYKWmUknrE-K_jIM8SBar7R7RKeGS83U5PjqnTdnPrKEXcYo95vsuIh6=w945-h945-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOB91i5xDaeV67AUqM7jVWk5Rh0ou5QVbsnVgUBMzhfqhpBkcZ6uDfR21LwjIw3SmF9uA_F_sRKBJUtO9nVfuamxBCVZu0OpjVVvhFZyOI_e9hCBtrygg4mBztc0D21gA_-0lZSJiT4eRam2T_5I_Pt=w900-h900-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPiIubve4r89kfjPfEQ1AS1eSSLBvqxXXzUax7EtELf5SnYyELdvWpVP-JnazIHOphH606fZtwc1SQv01p1TXOW5P0B9sb5gacVZdwj526XYoVwdEoa6xIZzb8gpx2AyUyz6qwbBy8HmSsSgv4GRMby=w989-h276-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO5TAmhY49_q8mR89oum6bPj7ZqKnRfdh3XNA78lSAqyJ2EzN25uR8t5oelN1p42bDqeQ-1OpEjyC-8qQqORXsZjt-k0tEy458lFjt7BpGGD6KnbaK_JXlST76WjVFQo2tx2x_H-2Gj3PtGzHIGBrUp=w989-h377-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMZRHjyjeH7yb0afOBhs-vrJWrGRZQitPPxotQkGS9kY-XtVT9J2jIcqgNKujOQnJT3HIlJAzYD9Wn2xUqmz6CrAvwXp1YgqvXUAbf0roebbnvoNqCVzMLSvpK47PdNAurI9WpPsO9X3qg9UbZFD1xQ=w989-h357-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMY0AZQvKM3g3BJ42mY9S-88g18LK7m_zzp2Qrqnm_Ux9CPC0_Ko_MKSLuROlEXL53-KavVp_Ri9zQJhH4MMjqG-Neyjjnqhehk2AXZx3EDgL7VlUF2a9iTjtmCMwLEjPYDPCUf3hNbFXS01yPQgOSl=w989-h638-s-no-gm?authuser=0"
];

// --- Types & Content Configuration ---

type Language = 'vi' | 'en';

const CONTENT = {
  vi: {
    nav: { schedule: 'Lịch trình', partners: 'Đối Tác', contact: 'Liên hệ', media: 'Truyền thông' },
    hero: {
      title1: 'NHỮNG NGƯỜI ĐỒNG HÀNH',
      title2: 'HỘI NGỘ TRI ÂM',
      date: '02 - 05.02.2026',
      locationLabel: 'Địa Điểm',
      location: 'Phú Quốc, Việt Nam',
      subtitle: '',
      quote: 'THỜI GIAN để gặp gỡ & KHÔNG GIAN để kết nối',
      button: 'Khám phá',
      countdown: { days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây' }
    },
    invitation: {
      quote: '"Architecture is the art of creating space for meeting and time for connection."',
      author: '- IAHAD -'
    },
    schedule: {
      title: 'Lịch trình',
      subtitle: '',
      generalNote: 'Lịch trình được xây dựng nhằm mang đến cho Quý vị trải nghiệm trọn vẹn tại Phú Quốc trong thời gian diễn ra sự kiện.\nNếu Quý vị không tham gia một số hoạt động theo lịch trình (ngày 3–4/2), vui lòng thông báo với PM của DMD. \nNếu không có cập nhật khác, các bữa ăn sẽ được bố trí như lịch trình kể từ thời điểm check-in.',
      notes: {
        title: 'Lưu ý tham quan',
        items: [
          'Trang phục lịch sự; quần dài, giày kín mũi.',
          'Giày đi bộ thoải mái.',
          'Tuân thủ các tuyến đường quy định và hướng dẫn an toàn tại chỗ.'
        ]
      },
      items: [
        {
          day: "02",
          dateSuffix: "Tháng 2",
          title: "",
          details: [
            {
              session: "Đón tiếp",
              events: [
                { time: "", text: "Đón khách (phụ thuộc vào lịch bay quốc tế của từng đoàn)." }
              ]
            }
          ]
        },
        {
          day: "03",
          dateSuffix: "Tháng 2",
          title: "",
          details: [
            {
              session: "Buổi sáng",
              events: [
                { time: "", text: "Đón khách" },
                { time: "", text: "Ăn trưa tại khách sạn lưu trú của khách" }
              ]
            },
            {
              session: "Buổi chiều | Thị trấn Hoàng hôn – Cầu Hôn",
              events: [
                { time: "16:45", text: "Di chuyển đến Thị trấn Hoàng hôn" },
                { time: "17:15", text: "Đến khu vực soát vé Cầu Hôn (cổng Bắc)" },
                { time: "17:15 - 17:30", text: "Ngắm hoàng hôn tại Cầu Hôn & chụp ảnh tập thể (17:30)" },
                { time: "18:00–18:45", text: "Dạo quanh Thị trấn Hoàng hôn" }
              ]
            },
            {
              session: "Buổi tối | Ăn tối & chương trình biểu diễn",
              events: [
                { time: "18:45–19:00", text: "Di chuyển đến Nhà hàng Sun Bavaria" },
                { time: "19:00", text: "Ăn tối" },
                { time: "19:30–20:05", text: "Show \"Bản Giao hưởng Đại dương\" (trong bữa tối)", link: "https://sunworld.vn/vi/hon-thom/cam-nang-du-lich/6-dieu-dac-biet-voi-symphony-of-the-sea-mua-2-12268", linkText: "Thông tin show diễn" },
                { time: "20:30", text: "(Tùy chọn) Di chuyển đến Show \"Nụ hôn của Biển cả\"" },
                { time: "21:00–21:35", text: "(Tùy chọn) Thưởng thức Show \"Nụ hôn của Biển cả\"", link: "https://kissofthesea.com.vn/", linkText: "Thông tin show diễn" },
                { time: "21:30", text: "Pháo hoa" },
                { time: "21:40", text: "Di chuyển về khách sạn", note: "(Quý khách xem show KOTS vui lòng quay lại Nhà hàng Sun Bavaria để tập trung và lên xe về khách sạn lúc 21:50)" }
              ]
            }
          ]
        },
        {
          day: "04",
          dateSuffix: "Tháng 2",
          title: "",
          details: [
            {
              session: "Buổi sáng | Tham quan công trường Sân bay PQ & APEC",
              events: [
                { time: "07:00–08:30", text: "Ăn sáng tại khách sạn" },
                { time: "08:30–09:00", text: "Di chuyển đến công trường Sân bay Phú Quốc" },
                { time: "09:00–09:30", text: "Tham quan công trường Sân bay Phú Quốc" },
                { time: "09:30–10:00", text: "Di chuyển đến công trường APEC" },
                { time: "10:00–10:30", text: "Tham quan công trường dự án APEC" },
                { time: "10:30–11:00", text: "Di chuyển đến Nhà hàng Draft Beer Bãi Khem" },
                { time: "11:00–12:30", text: "Ăn trưa" }
              ]
            },
            {
              session: "Buổi chiều | Tham quan Hòn Thơm",
              events: [
                { time: "13:00–13:30", text: "Di chuyển đến ga cáp treo" },
                { time: "13:30–14:00", text: "Di chuyển bằng cáp treo đến Hòn Thơm" },
                { time: "14:00–16:00", text: "Tham quan dự án tại Hòn Thơm" },
                { time: "16:00", text: "Di chuyển về ga cáp treo" },
                { time: "16:30", text: "Di chuyển về khách sạn" }
              ]
            },
            {
              session: "Tối | Dạ Tiệc Tri Âm",
              events: [
                { time: "19:00", text: "Gala Dinner (Xem chi tiết bên dưới)" }
              ]
            }
          ]
        },
        {
          day: "05",
          dateSuffix: "Tháng 2",
          title: "",
          details: [
            {
              session: "Chia tay",
              events: [
                { time: "", text: "Ăn sáng" },
                { time: "", text: "Tự do mua sắm" },
                { time: "", text: "Tiễn sân bay" }
              ]
            }
          ]
        }
      ]
    },
    gala: {
      title: 'Tiệc Gala Tri Âm',
      subtitle: '',
      dressCodeLabel: 'Trang phục',
      dressCode: 'Lịch sự, sáng tạo',
      dressCodeDesc: '',
      time: '19:00',
      timeDesc: 'Khai tiệc | 04.02.2026',
      venueLabel: 'Hội trường',
      venueName: 'Sun Signature Gallery',
      venueLink: 'https://sunsignaturegallery.com/gioi-thieu/',
      venueLinkText: 'Giới thiệu',
      venueMap: 'https://maps.app.goo.gl/6q7eed44Bc3rp28f6',
      venueMapText: 'Chỉ dẫn',
      program: [
        { time: "18:30", title: "Di chuyển đến Hội trường", desc: "" },
        { time: "19:00", title: "Đón khách & Nhạc chào mừng", desc: "" },
        { time: "19:30", title: "Khai mạc", desc: "" },
        { time: "19:35", title: "Thông điệp từ Chủ tịch HĐQT", desc: "" },
        { time: "19:45", title: "Phát biểu của Lãnh đạo BQLTK", desc: "" },
        { time: "19:55", title: "Phim Tri Âm", desc: "" },
        { time: "20:10", title: "Trình diễn đặc biệt", desc: "" },
        { time: "20:20", title: "Dùng tiệc", desc: "" }
      ]
    },
    partners: {
      title: 'Đối tác tham dự',
      subtitle: ''
    },
    contact: {
      title: 'Thông Tin Liên Hệ',
      subtitle: 'Hỗ trợ & Dịch vụ',
      note: 'Các thông tin liên quan đến chương trình, vui lòng liên hệ đại diện PM.\nĐối với các yêu cầu về dịch vụ khách sạn, vui lòng liên hệ quầy lễ tân.\nTrường hợp không liên hệ được các đầu mối trên, vui lòng gọi các số hotline sau.',
      items: [
        {
          hotel: 'Khách sạn JW Marriott Phu Quoc Emerald Bay',
          mapLink: 'https://maps.app.goo.gl/Ed1RN9NJxwwnGH596?g_st=ic',
          breakfast: 'Bữa sáng: từ 6:30 tại Nhà hàng',
          supportLabel: 'Hỗ trợ chung',
          contactName: 'Ms Hương',
          phone: '+84 704913177'
        },
        {
          hotel: 'Khách sạn Premier Village Phu Quoc Resort',
          mapLink: 'https://maps.app.goo.gl/VKGqV1pws3USQre36?g_st=ic',
          breakfast: 'Bữa sáng: từ 07:00 tại Nhà hàng',
          supportLabel: 'Hỗ trợ chung',
          contactName: 'Ms Uyên',
          phone: '+84 35236642'
        },
        {
          hotel: 'Khách sạn La Festa Phú Quốc',
          mapLink: 'https://maps.app.goo.gl/GtDTPoATjagoFan46?g_st=ic',
          breakfast: 'Bữa sáng: từ 07:00 tại Nhà hàng',
          supportLabel: 'Hỗ trợ chung',
          contactName: 'Ms Hương',
          phone: '+84 704913177'
        }
      ]
    },
    mediaNotice: {
      title: 'Truyền thông',
      content: 'Sự kiện có thể được chụp ảnh và ghi hình phục vụ mục đích truyền thông nội bộ.'
    },
    footer: {
      surtitle: '',
      title: 'NHỮNG NGƯỜI ĐỒNG HÀNH HỘI NGỘ TRI ÂM',
      location: 'Phú Quốc, Tháng 2 năm 2026',
      copyright: '© 2026 Sun Group. All rights reserved.',
      connect: 'Kết nối cùng DMD tại LinkedIn',
      linkedInUrl: 'https://www.linkedin.com/company/108153173/admin/page-posts/published/'
    },
    ai: {
      context: `
        Bạn là trợ lý ảo AI chuyên trách cho sự kiện "NHỮNG NGƯỜI ĐỒNG HÀNH HỘI NGỘ TRI ÂM". Hãy sử dụng thông tin CHI TIẾT dưới đây để trả lời người dùng:

        THÔNG TIN CHUNG:
        - Tên sự kiện: NHỮNG NGƯỜI ĐỒNG HÀNH HỘI NGỘ TRI ÂM
        - Thời gian: 02 - 05/02/2026
        - Địa điểm: Phú Quốc, Việt Nam

        LỊCH TRÌNH CHI TIẾT:
        * Ngày 02/02: Đón tiếp & Check-in tại JW Marriott Emerald Bay.
        * Ngày 03/02:
          - Sáng: Đón khách, Ăn trưa tại khách sạn lưu trú.
          - Chiều (Tham quan APEC):
            + 14:00: Di chuyển.
            + 14:30: Tham quan công trường APEC.
            + 15:30: Tham quan Sunset Town, di chuyển đến Cầu Hôn.
            + 16:00: Ngắm hoàng hôn Cầu Hôn & chụp ảnh.
          - Tối (Dinner & Show):
            + 18:00: Di chuyển đến Nhà hàng Sun Bavaria.
            + 18:45: Show Bản giao hưởng đại dương (xem từ nhà hàng).
            + 20:30: Đi bộ đến sân khấu.
            + 21:00: Show "Nụ hôn của Biển cả".
            + 21:30: Pháo hoa.
            + 21:40: Về khách sạn.
        * Ngày 04/02:
          - Sáng (Sân bay PQ):
            + 07:00: Ăn sáng.
            + 09:00: Di chuyển.
            + 09:45: Tham quan công trường Sân bay Phú Quốc.
            + 10:45: Di chuyển đến Draft Beer Bãi Khem.
            + 11:30: Ăn trưa.
          - Chiều (Hòn Thơm):
            + 13:00: Ra ga cáp treo.
            + 13:30: Cáp treo Hòn Thơm.
            + 14:00: Tham quan dự án Hòn Thơm.
            + 16:00: Cáp treo về.
            + 16:30: Về khách sạn.
          - Tối (Gala Dinner - Dạ Tiệc Tri Âm):
            + 18:30: Di chuyển đến Ballroom.
            + 19:00: Đón khách, chụp ảnh.
            + 19:30: Khai mạc.
            + 19:35: Phát biểu Tri Âm.
            + 19:40: Chiếu film.
            + 19:55: Trình diễn đặc biệt.
            + 20:05: Khai tiệc (Gala Dinner).
            + 22:00: Kết thúc & After Party.
        * Ngày 05/02: Ăn sáng, Tự do mua sắm, Tiễn sân bay.

        THÔNG TIN LIÊN HỆ & HỖ TRỢ:
        - Khách sạn JW Marriott Phu Quoc Emerald Bay: Ăn sáng từ 6:30. Liên hệ Ms Hương: +84 704913177.
        - Khách sạn Premier Village Phu Quoc Resort: Ăn sáng từ 7:00. Liên hệ Ms Uyên: +84 35236642.
        - Khách sạn La Festa Phú Quốc: Ăn sáng từ 7:00. Liên hệ Ms Hương: +84 704913177.

        LƯU Ý QUAN TRỌNG:
        - Dress code Gala Dinner: Lịch sự, sáng tạo.
        - Trang phục tham quan: Lịch sự, quần dài, giày kín mũi/giày đi bộ thoải mái.
        - Truyền thông: Sự kiện có chụp ảnh/ghi hình.

        HƯỚNG DẪN TRẢ LỜI:
        - Trả lời NGẮN GỌN, đúng trọng tâm.
        - Nếu hỏi số điện thoại, cung cấp chính xác tên và số.
        - Nếu hỏi lịch trình, chỉ đưa thông tin đúng ngày/giờ liên quan.
      `,
      welcome: 'Xin chào! Tôi là trợ lý ảo AI chuyên trách cho sự kiện Hội Ngộ Tri Âm. Tôi nắm rõ chi tiết lịch trình từng phút, thông tin liên hệ các đầu mối hỗ trợ và quy định trang phục. Tôi có thể giúp gì cho bạn?',
      placeholder: 'Hỏi về lịch trình, liên hệ, dress code...',
      supportTitle: 'Trợ Lý Sự Kiện',
      quickReplies: ['Lịch trình Gala Dinner tối 04/02?', 'Số điện thoại hỗ trợ tại JW Marriott?', 'Có bao nhiêu đối tác tham gia?', 'Quy định trang phục tham quan?']
    }
  },
  en: {
    nav: { schedule: 'Agenda', partners: 'Partners', contact: 'Contact', media: 'Media Notice' },
    hero: {
      title1: '',
      title2: 'PARTNER APPRECIATION',
      date: 'Feb 02 - 05, 2026',
      locationLabel: 'Location',
      location: 'Phu Quoc, Vietnam',
      subtitle: '',
      quote: 'TIME to meet & SPACE to connect',
      button: 'Discover',
      countdown: { days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs' }
    },
    invitation: {
      quote: '"Architecture is the art of creating space for meeting and time for connection."',
      author: '- IAHAD -'
    },
    schedule: {
      title: 'Agenda',
      subtitle: '',
      generalNote: 'The program is designed to be engaging yet flexible. Guests who do not participate in certain scheduled activities (Feb 3–4) please feel free to inform our PM representative.\nAll registered guests will be included in the scheduled meals from check-in onward unless otherwise notified.',
      notes: {
        title: 'Site Visit Notes',
        items: [
          'Smart casual attire; long pants and closed-toe shoes recommended.',
          'Comfortable walking shoes required.',
          'Follow designated routes and on-site safety instructions.'
        ]
      },
      items: [
        {
          day: "02",
          dateSuffix: "Feb",
          title: "",
          details: [
            {
              session: "Welcome",
              events: [
                { time: "", text: "Guest arrival (subject to respective international flight schedules)." }
              ]
            }
          ]
        },
        {
          day: "03",
          dateSuffix: "Feb",
          title: "",
          details: [
            {
              session: "Morning",
              events: [
                { time: "", text: "Guest arrival" },
                { time: "", text: "Lunch at guests' hotel" }
              ]
            },
            {
              session: "Afternoon | Sunset Town & Kiss Bridge",
              events: [
                { time: "16:45", text: "Transfer to Sunset Town" },
                { time: "17:15", text: "At the gate of the Kiss Bridge ticket checkpoint (North Gate)" },
                { time: "17:15 - 17:30", text: "Sunset at Kiss Bridge & group photo (photo at 17:30)" },
                { time: "18:00–18:45", text: "Stroll around Sunset Town" }
              ]
            },
            {
              session: "Evening | Dinner & Shows",
              events: [
                { time: "18:45–19:00", text: "Transfer to Sun Bavaria Restaurant" },
                { time: "19:00", text: "Dinner" },
                { time: "19:30–20:05", text: "Symphony of the Sea Show (during dinner)", link: "https://sunworld.vn/en/hon-thom/travel-guide/symphony-of-the-sea-6-unmissable-highlights-waiting-for-you-this-season-12268", linkText: "About the Show" },
                { time: "20:30", text: "(Optional) Walk to Kiss Of The Sea Show" },
                { time: "21:00–21:35", text: "(Optional) Kiss Of The Sea Show", link: "https://kissofthesea.com.vn/en/story", linkText: "About the show" },
                { time: "21:30", text: "Fireworks" },
                { time: "21:40", text: "Return to hotel\n(Guests attending the KOTS Show, please return to Sun Bavaria Restaurant for hotel transfer at 21:50)" }
              ]
            }
          ]
        },
        {
          day: "04",
          dateSuffix: "Feb",
          title: "",
          details: [
            {
              session: "Morning | Phú Quốc Airport & APEC Site Visits",
              events: [
                { time: "07:00–08:30", text: "Breakfast at the hotel" },
                { time: "08:30–09:00", text: "Transfer to Phú Quốc Airport construction site" },
                { time: "09:00–09:30", text: "Site visit – Phú Quốc Airport" },
                { time: "09:30–10:00", text: "Transfer to APEC construction site" },
                { time: "10:00–10:30", text: "Site visit – APEC project" },
                { time: "10:30–11:00", text: "Transfer to Draft Beer Bãi Khem Restaurant" },
                { time: "11:00–12:30", text: "Lunch" }
              ]
            },
            {
              session: "Afternoon | Hòn Thơm Island",
              events: [
                { time: "13:00–13:30", text: "Transfer to cable car station" },
                { time: "13:30–14:00", text: "Cable car to Hòn Thơm Island" },
                { time: "14:00–16:00", text: "Site visit – Hòn Thơm" },
                { time: "16:00", text: "Return to cable car station" },
                { time: "16:30", text: "Transfer back to hotel" }
              ]
            },
            {
              session: "Evening | Appreciation Gala Dinner",
              events: [
                { time: "19:00", text: "Gala Dinner (See details below)" }
              ]
            }
          ]
        },
        {
          day: "05",
          dateSuffix: "Feb",
          title: "",
          details: [
            {
              session: "Departure",
              events: [
                { time: "", text: "Breakfast" },
                { time: "", text: "Free time for shopping" },
                { time: "", text: "Airport transfer" }
              ]
            }
          ]
        }
      ]
    },
    gala: {
      title: 'Appreciation Gala Dinner',
      subtitle: '',
      dressCodeLabel: 'Attire',
      dressCode: 'Creative Formal',
      dressCodeDesc: '',
      time: '19:00',
      timeDesc: 'Reception | Feb 04, 2026',
      venueLabel: 'Venue',
      venueName: 'Sun Signature Gallery',
      venueLink: 'https://sunsignaturegallery.com/gioi-thieu/',
      venueLinkText: 'Venue Information',
      venueMap: 'https://maps.app.goo.gl/6q7eed44Bc3rp28f6',
      venueMapText: 'Directions',
      program: [
        { time: "18:30", title: "Transfer to the Ballroom", desc: "" },
        { time: "19:00", title: "Reception & Welcome Music", desc: "" },
        { time: "19:30", title: "Opening remarks", desc: "" },
        { time: "19:35", title: "Chairman’s Appreciation Address", desc: "" },
        { time: "19:45", title: "DMD Leadership Remarks", desc: "" },
        { time: "19:55", title: "Appreciation Film Presentation", desc: "" },
        { time: "20:10", title: "Special performance", desc: "" },
        { time: "20:20", title: "Gala Dinner", desc: "" }
      ]
    },
    partners: {
      title: 'Participating Partners',
      subtitle: 'We sincerely appreciate your presence'
    },
    contact: {
      title: 'Contact Information',
      subtitle: 'Support & Services',
      note: 'For any questions about the program, please reach out to your PM representative.\nFor hotel services, the reception desk will be happy to assist you.\nIn case the above contacts are unavailable, please contact the hotlines below.',
      items: [
        {
          hotel: 'JW Marriott Phu Quoc Emerald Bay',
          mapLink: 'https://maps.app.goo.gl/Ed1RN9NJxwwnGH596?g_st=ic',
          breakfast: 'Breakfast: from 06:30 at the restaurant',
          supportLabel: 'General Support',
          contactName: 'Ms Huong',
          phone: '+84 704913177'
        },
        {
          hotel: 'Premier Village Phu Quoc Resort',
          mapLink: 'https://maps.app.goo.gl/VKGqV1pws3USQre36?g_st=ic',
          breakfast: 'Breakfast: from 07:00 at the restaurant',
          supportLabel: 'General Support',
          contactName: 'Ms Uyen',
          phone: '+84 35236642'
        },
        {
          hotel: 'La Festa Phú Quốc Hotel',
          mapLink: 'https://maps.app.goo.gl/GtDTPoATjagoFan46?g_st=ic',
          breakfast: 'Breakfast: from 07:00 at the restaurant',
          supportLabel: 'General Support',
          contactName: 'Ms Huong',
          phone: '+84 704913177'
        }
      ]
    },
    mediaNotice: {
      title: 'Media Notice',
      content: 'Please note that photography and video recording may take place during the event for internal communication purposes.'
    },
    footer: {
      surtitle: '',
      title: 'PARTNER APPRECIATION',
      location: 'Phu Quoc, February 2026',
      copyright: '© 2026 Sun Group. All rights reserved.',
      connect: "Let's connect on LinkedIn",
      linkedInUrl: 'https://www.linkedin.com/company/108153173/admin/page-posts/published/'
    },
    ai: {
      context: `
        You are the AI Virtual Assistant for the event "Grand Reunion" (Hội Ngộ Tri Âm).
        Use the DETAILED information below to answer user queries:

        GENERAL INFO:
        - Event: PARTNER APPRECIATION (HỘI NGỘ TRI ÂM)
        - Date: Feb 02 - 05, 2026
        - Location: Phu Quoc, Vietnam

        DETAILED SCHEDULE:
        * Feb 02: Welcome & Check-in at JW Marriott Emerald Bay.
        * Feb 03:
          - Morning: Guest arrival, Lunch at guest's hotel.
          - Afternoon (APEC Site Visit):
            + 14:00: Transfer.
            + 14:30: Visit APEC construction site.
            + 15:30: Visit Sunset Town, transfer to Kiss Bridge.
            + 16:00: Sunset at Kiss Bridge & Group Photo.
          - Evening (Dinner & Show):
            + 18:00: Transfer to Sun Bavaria Restaurant.
            + 18:45: Dinner & Symphony of the Sea Show.
            + 20:30: Walk to Kiss Of The Sea venue.
            + 21:00: "Kiss Of The Sea" Show.
            + 21:30: Fireworks.
            + 21:40: Return to hotel.
        * Feb 04:
          - Morning (Airport Site Visit):
            + 07:00: Breakfast.
            + 09:00: Transfer.
            + 09:45: Visit Phu Quoc Airport construction site.
            + 10:45: Transfer to Draft Beer Bai Khem.
            + 11:30: Lunch.
          - Afternoon (Hon Thom):
            + 13:00: Transfer to cable car.
            + 13:30: Cable car to Hon Thom.
            + 14:00: Visit Hon Thom project.
            + 16:00: Return via cable car.
            + 16:30: Return to hotel.
          - Evening (Gala Dinner):
            + 18:30: Transfer to Ballroom.
            + 19:00: Reception.
            + 19:30: Opening.
            + 19:35: Appreciation Speech.
            + 19:40: Film.
            + 19:55: Special Performance.
            + 20:05: Gala Dinner.
            + 22:00: Closing & After Party.
        * Feb 05: Breakfast, Shopping, Airport Transfer.
        
        PARTNERS:
        - The event is joined by 124 valued partners.

        CONTACT & SUPPORT:
        - JW Marriott: Breakfast from 6:30. Support: Ms Bich +84 912 362 368.
        - Premier Residences: Breakfast from 6:30. Support: Ms Dieu Thu +84 935 402 989.
        - La Festa: Breakfast from 6:30. Support: Ms Kim Thanh +84 935 402 989.

        IMPORTANT NOTES:
        - Gala Dinner Attire: Creative Formal.
        - Site Visit Attire: Smart casual, long pants, closed-toe/walking shoes.
        - Media: Photography/Video recording will take place.

        INSTRUCTIONS:
        - Answer CONCISELY and DIRECTLY.
        - Provide exact phone numbers when asked for support.
        - Provide exact times when asked for agenda.
      `,
      welcome: 'Hello! I am the dedicated AI Assistant for the Partner Appreciation event. I have full details on the minute-by-minute agenda, information about our 124 partners, contact numbers for support, and attire guidelines. How may I help you today?',
      placeholder: 'Ask about agenda, contact, attire...',
      supportTitle: 'Event Assistant',
      quickReplies: ['Gala Dinner agenda on Feb 4?', 'Support number for JW Marriott?', 'How many partners?', 'Agenda for Feb 3?']
    }
  }
};

// --- Components ---

// Countdown Timer Component
const Countdown = ({ targetDate, labels }: { targetDate: string, labels: { days: string, hours: string, minutes: string, seconds: string } }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Stop timer or handle expiry
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center py-2 animate-fade-in-up">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center group min-w-[50px] md:min-w-[80px]">
          <div className="font-serif text-2xl md:text-5xl text-gold mb-1 md:mb-2 font-light tabular-nums drop-shadow-[0_0_10px_rgba(197,160,89,0.2)]">
            {(value as number) < 10 ? `0${value}` : value}
          </div>
          <div className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/50 border-t border-gold/20 pt-1 md:pt-2 group-hover:text-gold/80 transition-colors">
            {labels[unit as keyof typeof labels]}
          </div>
        </div>
      ))}
    </div>
  );
};

// Language Selector Component
const LanguageSelector = ({ onSelect }: { onSelect: (lang: Language) => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleSelect = (lang: Language) => {
    setIsExiting(true);
    setTimeout(() => {
      onSelect(lang);
    }, 800); // Match animation duration
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-800 ease-in-out bg-cover bg-center bg-no-repeat bg-charcoal ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundImage: `url(${BG_KEY_VISUAL})` }}
    >
      {/* Stardust pattern - matching Footer style */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

      {/* Decorative Border */}
      <div className="absolute inset-4 md:inset-10 border border-gold/30 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 w-full max-w-4xl px-4">
        <div className="animate-fade-in-up">
          <img src={LOGO_DMD} alt="DMD Logo" className="h-14 md:h-20 mx-auto mb-6 object-contain opacity-70 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
          <div className="text-[#fed05a] text-2xl mb-4 animate-pulse-slow mx-auto">✦</div>
          <h1 className="flex flex-col items-center mb-6">
            <span className="font-serif text-base sm:text-lg md:text-2xl text-[#fed05a] tracking-[0.2em] uppercase mb-2">NHỮNG NGƯỜI ĐỒNG HÀNH</span>
            <span className="font-serif text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] text-[#fed05a] tracking-widest uppercase leading-none whitespace-nowrap">HỘI NGỘ</span>
            <span className="font-serif text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] text-[#fed05a] tracking-widest uppercase leading-none whitespace-nowrap mt-2">TRI ÂM</span>
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-light tracking-[0.3em] uppercase opacity-70">Partner Appreciation</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 animate-fade-in-up items-center justify-center" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => handleSelect('vi')}
            className="group relative px-12 py-4 bg-transparent border border-gold/40 hover:border-gold hover:bg-gold/10 transition-all duration-500 w-64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="font-serif text-xl text-white group-hover:text-gold transition-colors duration-300">Tiếng Việt</span>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
          </button>

          <button
            onClick={() => handleSelect('en')}
            className="group relative px-12 py-4 bg-transparent border border-gold/40 hover:border-gold hover:bg-gold/10 transition-all duration-500 w-64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="font-serif text-xl text-white group-hover:text-gold transition-colors duration-300">English</span>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
          </button>
        </div>
      </div>
    </div>
  );
};


// Decorative Floral Branch Component (SVG) - Enhanced for Key Visual
const FloralBranch = ({ className = "", rotate = false, flip = false }: { className?: string, rotate?: boolean, flip?: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 300 300"
    className={`${className} ${rotate ? 'transform rotate-180' : ''} ${flip ? 'transform scale-x-[-1]' : ''}`}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main Branch */}
    <path d="M0,300 C50,280 80,250 100,200 C120,150 150,120 200,100 C250,80 280,50 300,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M100,200 C130,220 160,210 180,190" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M200,100 C220,130 250,140 270,120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M50,280 C70,260 40,240 60,220" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

    {/* Blossoms - Stylized like gold stamping */}
    <g opacity="0.9">
      {/* Large flowers */}
      <path d="M50,220 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M50,220 l-4,-4 M50,220 l4,4 M50,220 l-4,4 M50,220 l4,-4" strokeWidth="0.5" />
      <path d="M180,190 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" strokeWidth="0.5" />
      <path d="M270,120 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" strokeWidth="0.5" />
      <path d="M290,10 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0" strokeWidth="0.5" />

      {/* Buds */}
      <circle cx="120" cy="210" r="3" />
      <circle cx="210" cy="110" r="3" />
      <circle cx="80" cy="270" r="2" />
      <circle cx="250" cy="90" r="2" />
    </g>
  </svg>
);

// Architectural Side Panel (SVG) - For Cream/White Sections
const ArchitecturalPanel = ({ className = "", side = "left" }: { className?: string, side: "left" | "right" }) => (
  <div className={`absolute top-0 bottom-0 w-12 md:w-20 hidden lg:flex flex-col justify-between py-10 pointer-events-none opacity-40 z-0 ${side === "left" ? "left-0 border-r border-gold/20" : "right-0 border-l border-gold/20"} ${className}`}>
    {/* Top decorative element */}
    <div className="w-full h-32 border-y border-gold/30 relative">
      <div className="absolute inset-x-2 top-2 bottom-2 border border-gold/20"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-2">
        <div className="w-1 h-full bg-gold/10"></div>
      </div>
    </div>

    {/* Middle repeating lines */}
    <div className="flex-1 w-full flex justify-center gap-2 px-2 py-4">
      <div className="w-[1px] h-full bg-gold/20"></div>
      <div className="w-[1px] h-full bg-gold/20"></div>
      <div className="w-[1px] h-full bg-gold/20"></div>
    </div>

    {/* Bottom decorative element */}
    <div className="w-full h-32 border-y border-gold/30 relative">
      <div className="absolute inset-x-2 top-2 bottom-2 border border-gold/20"></div>
    </div>
  </div>
);

interface ScrollRevealProps {
  children?: ReactNode;
  delay?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-up ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Navigation Component
const Navigation = ({ content }: { content: any }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { label: content.nav.schedule, id: 'schedule' },
    { label: content.nav.partners, id: 'partners' },
    { label: content.nav.contact, id: 'contact' },
    { label: content.nav.media, id: 'media-notice' }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [content]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#2b0202] py-3 md:py-4 shadow-lg' : 'bg-transparent py-4 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-center md:justify-end items-center text-white">
        <div className="flex space-x-6 md:space-x-12 text-[10px] md:text-sm tracking-widest uppercase font-sans font-medium whitespace-nowrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`hover:text-gold transition-colors relative group py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold ${activeSection === item.id ? 'text-gold opacity-100' : 'opacity-80'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Partners Section
const PartnersSection = ({ content }: { content: any }) => {
  return (
    <section id="partners" className="py-20 md:py-32 bg-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>

      <div className="max-w-[1920px] mx-auto px-2 md:px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader title={content.partners.title} subtitle={content.partners.subtitle} />

          {/* Responsive Grid: 4 cols (mobile), 8 cols (tablet), 13 cols (desktop) */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 md:gap-4 justify-items-center">
            {PARTNER_LOGOS.map((url, idx) => (
              <div key={idx} className="w-full aspect-[3/2] p-1 md:p-2 bg-white border border-gray-100 shadow-sm rounded flex items-center justify-center hover:shadow-md hover:border-gold/30 hover:scale-105 transition-all duration-300 group">
                <img
                  src={url}
                  alt={`Partner ${idx + 1}`}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// Enhanced Section Header
const SectionHeader = ({ title, subtitle, dark = false, className = "" }: { title: string, subtitle?: string, dark?: boolean, className?: string }) => (
  <div className={`text-center mb-8 md:mb-12 relative px-4 ${className}`}>
    {/* Decorative symbol */}
    <div className={`text-2xl md:text-4xl mb-3 md:mb-5 ${dark ? 'text-gold' : 'text-viet-red'}`}>
      ✦
    </div>
    <h2 className={`font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-5 leading-tight ${dark ? 'gold-gradient-text' : 'text-viet-red'}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`font-sans text-[10px] md:text-sm lg:text-base tracking-[0.25em] uppercase opacity-80 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// --- Chatbot Component ---

const ChatWidget = ({ content }: { content: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, image?: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([{ role: 'model', text: content.ai.welcome }]);
    // rotate session id when the chat is reset by language change
    setSessionId(`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`);
  }, [content]);

  const resetChat = () => {
    setMessages([{ role: 'model', text: content.ai.welcome }]);
    setSessionId(`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render text with basic markdown support (bold **text**) and line breaks
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return <strong key={index} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </div>
    );
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedImage) return;

    // UI Updates
    const newMessages = [...messages, {
      role: 'user' as const,
      text: textToSend,
      image: selectedImage ? selectedImage : undefined
    }];
    setMessages(newMessages);
    setInput('');
    // Store image for this turn but clear state
    const imageForRequest = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Send user messages + session to external webhook (n8n)
      const webhookUrl = 'https://vbdh-sgr.com/webhook/1d622d07-3ae2-4820-8b74-4e53ce0469cb/chat';

      // Prepare messages payload (include all messages so far, plus this user turn)
      const payloadMessages = newMessages.map(m => ({ role: m.role, text: m.text }));

      const body = {
        session_id: sessionId,
        messages: payloadMessages,
        // keep a short convenience field for the latest user input
        latest: textToSend,
        // n8n 'guardrails' node expects prompt in 'guardrailsInput' — include for compatibility
        // send as object with `prompt` field per n8n guardrails node expectations
        guardrailsInput: { prompt: textToSend }
      };

      // 60s timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        console.error('Webhook error status', resp.status);
        setMessages(prev => [...prev, { role: 'model', text: "Error from webhook. Please try again later." }]);
        return;
      }

      // Webhook can return either a single JSON object or a stream/NDJSON sequence of JSON objects.
      // Try to parse JSON normally, otherwise fallback to text parsing and collect 'content' pieces.
      let json: any = null;
      try {
        json = await resp.json();
      } catch (parseErr) {
        try {
          const raw = await resp.text();
          const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          const pieces: string[] = [];
          for (const line of lines) {
            try {
              const obj = JSON.parse(line);
              if (obj && obj.content) pieces.push(String(obj.content));
              else if (obj && (obj.output || obj.output_text || obj.text)) pieces.push(String(obj.output || obj.output_text || obj.text));
            } catch (err) {
              // ignore non-json lines
            }
          }
          if (pieces.length) {
            json = { output: pieces.join('') };
          } else {
            // fallback: if raw contains JSON objects stuck together, try to pull "content" substrings as a last resort
            const contentMatches = raw.match(/"content"\s*:\s*"([^"]+)"/g);
            if (contentMatches) {
              const extracted = contentMatches.map(m => m.replace(/"content"\s*:\s*"/, '').replace(/"$/, '')).join('');
              json = { output: extracted };
            }
          }
        } catch (err) {
          console.error('Failed to parse webhook streaming response', err);
        }
      }

      // Prefer structured 'output' fields; if n8n returns an error object like { type: 'error', content: '...' } show that content.
      let botMessage = "No response from webhook.";
      if (json) {
        if (json.type === 'error' && json.content) {
          botMessage = json.content;
        } else if (json.output || json.output_text || json.text) {
          botMessage = json.output || json.output_text || json.text;
        } else if (typeof json === 'string') {
          botMessage = json;
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: botMessage }]);
    } catch (error) {
      console.error("Chat error:", error);
      const isAbort = (error && error.name === 'AbortError');
      setMessages(prev => [...prev, { role: 'model', text: isAbort ? "Timed out waiting for webhook (60s). Please try again." : "Error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] font-sans">
      {isOpen && (
        <div className="absolute bottom-16 md:bottom-20 right-0 w-[85vw] md:w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gold/40 animate-fade-in-up origin-bottom-right transition-all duration-300 h-[500px] md:h-[600px] max-h-[80vh]">
          <div className="bg-viet-red text-white p-4 md:p-6 flex justify-between items-center shadow-md relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold flex items-center justify-center text-viet-red font-bold text-xs md:text-sm shadow-inner border border-white/20">SG</div>
              <div>
                <h3 className="font-serif text-base md:text-lg tracking-wide">{content.ai.supportTitle}</h3>
                <p className="text-[10px] text-gold-light opacity-80 uppercase tracking-widest">Tri Âm 2026</p>
              </div>
            </div>

            {/* Reset button to start a fresh session */}
            <button onClick={resetChat} title="Reset chat" className="text-white/80 hover:text-white relative z-10 p-1 mr-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 4V1L6 5l4 4V6a4 4 0 110 8 4 4 0 01-3.464-2H5.1A5.99 5.99 0 0010 16a6 6 0 000-12z" />
              </svg>
            </button>

            <button onClick={toggleChat} className="text-white/80 hover:text-white relative z-10 p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-cream space-y-3 md:space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.image && (
                  <div className="mb-2 max-w-[85%] rounded-2xl overflow-hidden border border-gold/30">
                    <img src={msg.image} alt="User upload" className="w-full h-auto object-cover max-h-48" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 md:px-5 md:py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-viet-red text-gold-light rounded-br-none border border-gold/30'
                    : 'bg-white border border-gray-100 text-charcoal rounded-bl-none'
                  }`}>
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-gray-100 flex flex-col gap-3 shrink-0">
            {/* Image Preview */}
            {selectedImage && (
              <div className="relative inline-block w-16 h-16 border border-gray-200 rounded-lg overflow-hidden shrink-0 self-start ml-2">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-red-500/80 text-white rounded-bl-md p-0.5 hover:bg-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Quick Replies */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
              {content.ai.quickReplies.map((reply: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-3 py-1.5 bg-cream border border-gold/40 text-viet-red text-xs rounded-full hover:bg-gold hover:text-white transition-colors shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center w-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 hover:text-viet-red transition-colors shrink-0"
                title="Upload Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={content.ai.placeholder}
                className="flex-1 bg-gray-50 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-shadow min-w-0"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gold text-viet-red flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-colors disabled:opacity-50 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="w-14 h-14 md:w-16 md:h-16 bg-viet-red rounded-full shadow-[0_4px_30px_rgba(212,175,55,0.6)] flex items-center justify-center text-gold hover:scale-110 transition-transform duration-300 border-2 border-gold group relative overflow-visible focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
      >
        {/* Pulsing ring for attention */}
        <span className="absolute inset-0 rounded-full border border-gold opacity-70 animate-ping"></span>

        {/* AI Badge/Label */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 bg-gold text-viet-red text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
            AI
          </div>
        )}

        <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState<Language | null>(null);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  const downloadICS = () => {
    const event = {
      title: "NHỮNG NGƯỜI ĐỒNG HÀNH HỘI NGỘ TRI ÂM",
      description: "Partner Appreciation Event by Sun Group",
      location: "Phú Quốc, Việt Nam",
      start: "20260202T000000",
      end: "20260205T235900"
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SunGroup//PartnerAppreciation//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@sungroup.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'HoiNgoTriAm2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!lang) return <LanguageSelector onSelect={setLang} />;

  const c = CONTENT[lang];

  return (
    <main className="relative w-full overflow-hidden bg-cream text-charcoal">
      <Navigation content={c} />

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
        <div className="absolute inset-0 bg-cover bg-center z-0 fixed" style={{ backgroundImage: `url(${BG_KEY_VISUAL})` }}></div>
        {/* Removed heavy dark overlays to match footer brightness */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0"></div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto mt-10">
          <div className="animate-fade-in-down">
            <img src={LOGO_DMD} alt="DMD Logo" className="h-14 md:h-20 mx-auto mb-8 object-contain opacity-70 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
            <p className="font-sans text-sm md:text-lg tracking-[0.3em] uppercase mb-4 text-gold-light">{c.hero.subtitle}</p>
            <h1 className="flex flex-col items-center mb-6 text-center">
              {lang === 'en' ? (
                <>
                  <span className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#fed05a] tracking-widest uppercase leading-none font-medium">
                    PARTNER
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-[#fed05a] tracking-widest uppercase leading-none font-medium mt-2">
                    APPRECIATION
                  </span>
                </>
              ) : (
                <>
                  <span className="font-serif text-lg md:text-2xl lg:text-3xl text-[#fed05a] tracking-[0.2em] uppercase mb-2 md:mb-4">{c.hero.title1}</span>
                  <span className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#fed05a] tracking-widest uppercase leading-none font-medium whitespace-nowrap">HỘI NGỘ</span>
                  <span className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#fed05a] tracking-widest uppercase leading-none font-medium whitespace-nowrap mt-2">TRI ÂM</span>
                </>
              )}
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto my-8"></div>
            <div className="font-sans text-lg md:text-xl tracking-widest mb-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
              <span>{c.hero.date}</span>
              <span className="hidden md:inline mx-2 text-gold">•</span>
              <span>{c.hero.location}</span>
            </div>

            {/* Add to Calendar Button */}
            <button
              onClick={downloadICS}
              className="mb-8 inline-flex items-center gap-2 px-6 py-2 border border-gold/50 rounded-full text-gold-light hover:bg-gold/20 hover:text-white transition-all text-xs uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="font-serif italic text-xl md:text-2xl opacity-90 mb-10">"{c.hero.quote}"</p>
            <Countdown targetDate="2026-02-02T00:00:00" labels={c.hero.countdown} />
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" /></svg>
          </div>
        </div>
      </header>

      {/* SCHEDULE */}
      <section id="schedule" className="py-20 md:py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${BG_SCHEDULE_MAIN})` }}>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/80 z-0"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <SectionHeader title={c.schedule.title} subtitle={c.schedule.subtitle} />
            <div className="text-center max-w-4xl mx-auto mb-16 text-gray-600 italic whitespace-pre-line px-4">
              {c.schedule.generalNote}
            </div>
          </ScrollReveal>

          <div className="space-y-12 md:space-y-24">
            {c.schedule.items.map((item: any, idx: number) => (
              <ScrollReveal key={idx} className="relative pl-0 md:pl-0">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                  <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 border-b md:border-b-0 md:border-r border-gold/30 pb-4 md:pb-0 md:pr-8">
                    <span className="font-serif text-6xl md:text-8xl text-gold opacity-20 leading-none">{item.day}</span>
                    <span className="font-sans text-sm tracking-widest uppercase text-gray-500 mt-2">{item.dateSuffix}</span>
                  </div>

                  <div className="flex-1 pt-2 w-full">
                    {item.title && <h3 className="font-serif text-2xl md:text-4xl text-viet-red mb-4 md:mb-6">{item.title}</h3>}
                    {item.desc && <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{item.desc}</p>}

                    {item.details && (
                      <div className="space-y-8 mt-6">
                        {item.details.map((detail: any, dIdx: number) => (
                          <div key={dIdx} className="bg-cream p-6 md:p-8 rounded-lg border-l-2 border-gold/50 hover:shadow-lg transition-all duration-300 shadow-md">
                            <h4 className="font-sans font-bold text-charcoal uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 bg-gold rounded-full"></span>
                              {detail.session}
                            </h4>
                            <ul className="space-y-3">
                              {detail.events.map((event: any, eIdx: number) => (
                                <li key={eIdx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-700 text-sm md:text-base border-b border-gold/10 last:border-0 pb-2 last:pb-0">
                                  <span className="font-mono text-gold-dark font-medium w-full sm:w-24 shrink-0">{event.time}</span>
                                  <div className="flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center whitespace-pre-line">
                                    <span>{event.text}</span>
                                    {event.link && (
                                      <a
                                        href={event.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gold hover:text-viet-red underline underline-offset-4 text-xs uppercase tracking-wider inline-flex items-center gap-1 font-bold whitespace-nowrap"
                                      >
                                        {event.linkText || "Info"}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      </a>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 md:mt-24 bg-[#fdfbf7] border border-gold/20 p-6 md:p-10 rounded max-w-3xl mx-auto text-center shadow-sm">
            <h4 className="font-serif text-xl text-viet-red mb-4">{c.schedule.notes.title}</h4>
            <ul className="text-sm text-gray-600 space-y-2 inline-block text-left list-disc pl-5">
              {c.schedule.notes.items.map((note: string, idx: number) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* GALA DINNER */}
      <section id="gala" className="py-20 md:py-32 bg-charcoal text-white relative overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${BG_KEY_VISUAL})` }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0"></div>
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-viet-red/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <SectionHeader title={c.gala.title} subtitle={c.gala.subtitle} dark />

            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="text-center md:text-right space-y-8">
                <div className="p-6 border border-gold/30 rounded inline-block bg-white/5 backdrop-blur-sm">
                  <div className="text-gold font-serif text-5xl mb-2">{c.gala.time}</div>
                  <div className="text-gray-400 text-sm tracking-widest uppercase">{c.gala.timeDesc}</div>
                </div>

                <div className="mt-6 text-center md:text-right">
                  <h3 className="text-gold font-sans uppercase tracking-widest text-sm mb-1">{c.gala.venueLabel}</h3>
                  <p className="font-serif text-xl md:text-2xl text-white mb-2">{c.gala.venueName}</p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-end text-xs md:text-sm text-gold/80">
                    <a href={c.gala.venueLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-gold/50 pb-0.5 inline-flex items-center gap-1 justify-center md:justify-end">
                      {c.gala.venueLinkText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <a href={c.gala.venueMap} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-gold/50 pb-0.5 inline-flex items-center gap-1 justify-center md:justify-end">
                      {c.gala.venueMapText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-gold font-sans uppercase tracking-widest text-sm mb-3">{c.gala.dressCodeLabel}</h3>
                  <p className="font-serif text-2xl md:text-3xl mb-2">{c.gala.dressCode}</p>
                  <p className="text-white/80 text-sm italic">{c.gala.dressCodeDesc}</p>
                </div>
              </div>

              <div className="border-l border-gold/20 pl-8 md:pl-16 relative">
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-gold rounded-full"></div>
                <div className="space-y-8">
                  {c.gala.program.map((item: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="flex items-baseline gap-4 mb-1">
                        <span className="text-gold font-mono text-lg group-hover:text-white transition-colors whitespace-nowrap">{item.time}</span>
                        <span className="font-bold text-xl">{item.title}</span>
                      </div>
                      <p className="text-white/70 text-sm pl-16 md:pl-20 group-hover:text-white transition-colors">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-gold rounded-full"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PartnersSection content={c} />

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-32 bg-cream relative">
        <ArchitecturalPanel side="right" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <SectionHeader title={c.contact.title} subtitle={c.contact.subtitle} className="mb-4 md:mb-6" />
            <p className="text-center max-w-3xl mx-auto mb-10 md:mb-16 text-gray-600 italic px-4 whitespace-pre-line">{c.contact.note}</p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {c.contact.items.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded shadow-sm border-t-4 border-gold hover:shadow-xl transition-all duration-300 group">
                  <h3 className="font-serif text-xl text-viet-red mb-4 h-16 flex items-center">
                    <a
                      href={item.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold transition-colors flex items-center gap-2 w-full"
                    >
                      <span className="flex-1">{item.hotel}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </a>
                  </h3>
                  <div className="w-12 h-[1px] bg-gray-200 mb-6 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-sm text-gray-600 mb-6 flex items-start gap-2">
                    <span className="text-gold">☕</span> {item.breakfast}
                  </p>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{item.supportLabel}</p>
                    <p className="font-bold text-charcoal text-lg">{item.contactName}</p>
                    <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="text-gold hover:text-viet-red transition-colors font-mono mt-1 block">
                      {item.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="media-notice" className="py-12 relative overflow-hidden bg-cover bg-center border-t-4 border-gold" style={{ backgroundImage: `url(${BG_KEY_VISUAL})` }}>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h4 className="font-sans font-bold text-gold/80 uppercase text-xs tracking-widest mb-3">{c.mediaNotice.title}</h4>
          <p className="text-white/80 text-sm italic leading-relaxed">{c.mediaNotice.content}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-white py-16 md:py-24 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${BG_KEY_VISUAL})` }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="w-32 h-20 mx-auto mb-8 transition-all duration-500 flex items-center justify-center">
            <img src={LOGO_DMD} alt="DMD Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <p className="font-sans text-xs tracking-[0.3em] text-gray-400 uppercase mb-4">{c.footer.surtitle}</p>
          <h2 className="font-serif text-2xl md:text-4xl text-[#fed05a] mb-6 tracking-wide">{c.footer.title}</h2>
          <p className="text-gold text-sm tracking-widest uppercase mb-12">{c.footer.location}</p>

          <div className="flex justify-center space-x-6 mb-12">
            <a href={c.footer.linkedInUrl} target="_blank" rel="noreferrer" className="text-gold hover:text-white transition-all duration-300 flex items-center gap-3 text-base border border-gold px-8 py-3 rounded-full hover:bg-gold/20 hover:border-white shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              <span>{c.footer.connect}</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
          </div>

          <div className="border-t border-gray-700/50 pt-8 text-xs text-white">
            <p>{c.footer.copyright}</p>
          </div>
        </div>
      </footer>

      <ChatWidget content={c} />
    </main>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

export default App;