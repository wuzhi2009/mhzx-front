import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        var location = useLocation();
        var navigate = useNavigate();
        var params = useParams();
        return (
            <Component {...props} router= { {location, navigate, params} } />
        );
    }
    return ComponentWithRouterProp;
}