/**
 * Takes a loading property as input and displays a circular progress
 * widget if loading is set to true. Otherwise displays child content. 
 */
import { CircularProgress } from '@material-ui/core'

export default function LoadingWrapper({ children, loading }) {

    function displayLoadingOrContent() {
        if (loading) {
            return <CircularProgress/>;
        } else {
            return children;
        }
    }

    return (
        <>
          {displayLoadingOrContent()}
        </>); 
}