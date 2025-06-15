import {
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";

function featuresCard({ color, icon, title, description }) {
  return (
    <Card className="rounded-lg shadow-lg shadow-gray-500/10">
      <CardBody className="px-8 text-center">
        <IconButton
          variant="gradient"
          size="lg"
          color={color}
          className="pointer-events-none mb-6 rounded-full"
        >
          {icon}
        </IconButton>
        <Typography variant="h5" className="mb-2" color="blue-gray">
          {title}
        </Typography>
        <Typography className="font-normal text-blue-gray-600">
          {description}
        </Typography>
      </CardBody>
    </Card>
  )
}

export default featuresCard


