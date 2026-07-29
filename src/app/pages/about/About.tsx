import { useTranslation } from "react-i18next";
import Seo from "../../main/seo/Seo";

import aboutSeoData from "../../main/seo/about-metadata";

const About = () => {
  const { t } = useTranslation();
  return (
    <Seo {...aboutSeoData(t)}>
      <section className="text-brand-lightGray px-6 py-12 md:px-16 lg:px-32 w-full">
        <div className="max-w-5xl mx-auto text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-4 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("about.head")}</p>
        </div>

        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h2 className="text-2xl font-bold text-brand-white mb-8">
            {t("about.t0")}
          </h2>
          <p className="text-lg leading-relaxed mb-6">{t("about.text0")}</p>

          <h2 className="text-2xl font-bold text-brand-white mb-8">
            {t("about.t1")}
          </h2>
          <p className="text-lg leading-relaxed mb-6">{t("about.text1")}</p>

          <h2 className="text-2xl font-bold text-brand-white mb-8">
            {t("about.t2")}
          </h2>
          <p className="text-lg leading-relaxed mb-6">{t("about.text2")}</p>

          <h2 className="text-2xl font-bold text-brand-white mb-8">
            {t("about.t3")}
          </h2>
          <p className="text-lg leading-relaxed mb-6">{t("about.text3")}</p>

          <h2 className="text-2xl font-bold text-brand-white mb-8">
            {t("about.t4")}
          </h2>
          <p className="text-lg leading-relaxed mb-6">{t("about.text4")}</p>
        </div>
      </section>
    </Seo>
  );
};

export default About;
