import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { MapPin, Navigation, Building2, GraduationCap, Hospital, Plane, Home } from 'lucide-react';
import { searchLocations, type Location } from '../data/locations';

interface LocationAutocompleteProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string, location?: Location) => void;
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export function LocationAutocomplete({
  id,
  placeholder,
  value,
  onChange,
  onLocationSelect,
  className
}: LocationAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchLocations(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else if (value.length === 0) {
      // Mostrar ubicaciones populares cuando está vacío
      setSuggestions(searchLocations(''));
      setShowSuggestions(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value]);

  // Cerrar sugerencias cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    onChange(location.name, location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'transport':
        return <Navigation className="h-4 w-4 text-blue-600" />;
      case 'commercial':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'educational':
        return <GraduationCap className="h-4 w-4 text-green-600" />;
      case 'medical':
        return <Hospital className="h-4 w-4 text-red-600" />;
      case 'landmark':
        return <MapPin className="h-4 w-4 text-orange-600" />;
      case 'residential':
        return <Home className="h-4 w-4 text-gray-600" />;
      case 'government':
        return <Building2 className="h-4 w-4 text-indigo-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto shadow-lg">
          <div className="py-2">
            {suggestions.map((location, index) => (
              <button
                key={location.id}
                type="button"
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSelect(location)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getLocationIcon(location.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {location.name}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {location.address}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {location.city}, {location.province}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
