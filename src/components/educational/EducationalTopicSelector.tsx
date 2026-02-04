import { useState } from 'react';
import { 
  EducationalCategory, 
  EducationalTopic, 
  categoryLabels, 
  categoryDescriptions,
  defaultTopics 
} from '@/types/educational';
import { 
  HelpCircle, Wallet, ShieldAlert, Calculator, Route, Users, 
  Home, TrendingUp, Building, Award, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationalTopicSelectorProps {
  selectedCategory: EducationalCategory;
  selectedTopicId: string;
  onCategoryChange: (category: EducationalCategory) => void;
  onTopicChange: (topic: EducationalTopic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Route: <Route className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
};

const categories: EducationalCategory[] = ['tips', 'process', 'stories', 'institutional'];

const categoryIcons: Record<EducationalCategory, React.ReactNode> = {
  tips: <HelpCircle className="w-5 h-5" />,
  process: <Route className="w-5 h-5" />,
  stories: <Home className="w-5 h-5" />,
  institutional: <Building className="w-5 h-5" />,
};

export const EducationalTopicSelector = ({
  selectedCategory,
  selectedTopicId,
  onCategoryChange,
  onTopicChange,
}: EducationalTopicSelectorProps) => {
  const [expandedCategory, setExpandedCategory] = useState<EducationalCategory | null>(selectedCategory);

  const topicsByCategory = defaultTopics.filter(t => t.category === selectedCategory);

  const handleCategoryClick = (category: EducationalCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    if (category !== selectedCategory) {
      onCategoryChange(category);
      const firstTopic = defaultTopics.find(t => t.category === category);
      if (firstTopic) {
        onTopicChange(firstTopic);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
              selectedCategory === category
                ? "border-[#BA9E72] bg-[#BA9E72]/10 text-[#BA9E72]"
                : "border-gray-200 hover:border-gray-300 text-gray-600"
            )}
          >
            {categoryIcons[category]}
            <div>
              <p className="text-sm font-medium">{categoryLabels[category]}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Topic Selection */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
          Selecione um tema
        </p>
        <div className="space-y-2">
          {topicsByCategory.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicChange(topic)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                selectedTopicId === topic.id
                  ? "border-[#BA9E72] bg-[#BA9E72]/5"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                selectedTopicId === topic.id
                  ? "bg-[#BA9E72] text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
              )}>
                {iconMap[topic.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm truncate",
                  selectedTopicId === topic.id ? "text-[#BA9E72]" : "text-gray-700"
                )}>
                  {topic.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{topic.description}</p>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-colors",
                selectedTopicId === topic.id ? "text-[#BA9E72]" : "text-gray-300"
              )} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
