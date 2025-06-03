import IconCSharp from "../../assets/Icons/IconCSharp";
import IconJava from "../../assets/Icons/IconJava";
import IconHTML from "../../assets/Icons/IconHTML";
import IconCss from "../../assets/Icons/IconCss";
import IconJavaScript from "../../assets/Icons/IconJavaScript";
import IconTypeScript from "../../assets/Icons/IconTypeScript";
import IconPython from "../../assets/Icons/IconPython";
import IconMonggoDB from "../../assets/Icons/IconMonggoDB";
import IconReactJS from "../../assets/Icons/IconReactJS";
import IconNextJS from "../../assets/Icons/IconNextJS";
import IconExpressJS from "../../assets/Icons/IconExpressJS";
import IconSQLServer from "../../assets/Icons/IconSQLServer";
import IconAngularJS from "../../assets/Icons/IconAngularJS";
import IconDjango from "../../assets/Icons/IconDjango";
import IconVueJS from "../../assets/Icons/IconVueJS";
import IconNetCore from "../../assets/Icons/IconNetCore";
import OrbitIcons from "../../components/Animations/OrbitIcons";


export default function Home() {


    return (

        
        <div className="conatiner">
           

            

             <OrbitIcons
                    icons={[
                        <IconJavaScript key="javaScript" />,
                        <IconTypeScript key="typeScript" />,
                        <IconPython key="python" />,
                        <IconJava key="java" />,
                        <IconCSharp key="c#" />,
                        <IconSQLServer key="sqlServer" />,
                        <IconMonggoDB key="mongoDB" />,
                        <IconHTML key="html" />,
                        <IconCss key="css" />,
                    ]}
                    outerIcons={[
                        <IconReactJS key="reactJS" />,
                        <IconNextJS key="nextJS" />,
                        <IconAngularJS key="angularJS"/>,
                        <IconVueJS key="vueJS"/>,
                        <IconNetCore key="net"/>,
                        <IconDjango key="django" />,
                        <IconExpressJS key="expressJS" />,
                    ]}
                    size={220}
                    iconSize={40}
                    outerIconSize={48}
                />

        </div>
    )
}