import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from "@react-navigation/native";

import MainLayout from "../layouts/MainLayout";
import Banner from "../components/home/Banner";
import MyLibraryPreview from "../components/home/MyLibraryPreview";
import GroupSection from "../components/group/GroupSection";
import Search from "../components/common/Search";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); 
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setRefreshKey(prev => prev + 1);
    }
  }, [isFocused]);
  
  return (
    <MainLayout>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingTop: 28, paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: -30, marginBottom: 20 }}>
          <Banner />
        </View>
        <Search 
          placeholder="검색" 
          onPress={() => navigation.navigate("SearchScreen")} 
          editable={false} 
        />
        <GroupSection />
        <MyLibraryPreview key={`library-${refreshKey}`}/>
      </KeyboardAwareScrollView>
    </MainLayout>
  );
};

export default HomeScreen;