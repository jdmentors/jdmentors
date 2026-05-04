import { DollarSign, TrendingUp, Award } from "lucide-react";
  import Container from "./Container";

  const defaultBreakdown = [
      {
          icon: <Award size={22} />,
          value: "$74K/yr",
          label: "Largest single scholarship secured",
      },
      {
          icon: <TrendingUp size={22} />,
          value: "3.2x",
          label: "Average scholarship increase after negotiation",
      },
      {
          icon: <DollarSign size={22} />,
          value: "100%",
          label: "Of students received merit aid",
      },
  ];

  const defaultDescription =
      "Across our students, we've helped negotiate and secure millions" +
      " in merit-based scholarships and financial aid — turning admit" +
      " letters into affordable degrees.";

  const cardClass =
      "rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800" +
      " text-white p-8 md:p-12 shadow-xl shadow-blue-200";

  const tileClass =
      "bg-white/10 backdrop-blur-sm border border-white/20" +
      " rounded-xl p-5 text-center";

  const iconClass =
      "w-11 h-11 bg-white/20 rounded-lg flex items-center" +
      " justify-center mx-auto mb-3";

  function ScholarshipSavings({
      headline = "Scholarship Dollars Secured",
      total = "$2.5M+",
      description = defaultDescription,
      breakdown = defaultBreakdown,
  }) {
      return (
          <section className="mt-14 md:mt-18">
              <Container>
                  <div className={cardClass}>
                      <div className="grid lg:grid-cols-5 gap-8 items-center">
                          <div className="lg:col-span-2 text-center lg:text-left">
                              <p className="uppercase tracking-wider text-blue-200 text-sm mb-2">{headline}</p>
                              <p className="text-6xl md:text-7xl font-bold mb-4">{total}</p>
                              <p className="text-blue-100 leading-relaxed">{description}</p>
                          </div>

                          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
                              {breakdown.map((item) => (
                                  <div key={item.label} className={tileClass}>
                                      <div className={iconClass}>
                                          {item.icon}
                                      </div>
                                      <p className="text-3xl font-bold mb-1">{item.value}</p>
                                      <p className="text-sm text-blue-100">{item.label}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </Container>
          </section>
      );
  }

  export default ScholarshipSavings;
