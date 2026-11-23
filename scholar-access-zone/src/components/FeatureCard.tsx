
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  buttonText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  to,
  buttonText
}) => {
  return (
    <Card className="feature-card h-full">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-portal-lightblue mb-4">
          <Icon className="h-6 w-6 text-portal-blue" />
        </div>
        <CardTitle className="text-lg font-bold text-portal-blue">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-portal-blue hover:bg-blue-700">
          <Link to={to}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
