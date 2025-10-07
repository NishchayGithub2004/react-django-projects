import { Box, VStack } from "@chakra-ui/react" // import Chakra UI components for layout and vertical stacking
import Navbar from "./navbar" // import Navbar component for top navigation

const Layout = ({ children }) => { // define a functional component to provide page layout, accepts children components
    return (
        <VStack w='100vw' minH='100vh' bg='#FCFCFC'> {/* vertical stack covering full viewport width and minimum height, with background color */}
            <Navbar /> {/* render Navbar at the top */}
            <Box w='100%'> {/* box container for rendering children content */}
                {children} {/* render the children passed to Layout */}
            </Box>
        </VStack>
    )
}

export default Layout; // export Layout component for use in wrapping pages/components
