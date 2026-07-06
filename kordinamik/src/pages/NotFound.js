import React from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const PageContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  paddingTop: "80px",
  textAlign: "center",
});

const NotFound = () => {
  return (
    <PageContainer>
      <Box>
        <Typography
          sx={{
            fontSize: "8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
          Sayfa Bulunamadı
        </Typography>
        <Typography sx={{ color: "#666", mb: 4, maxWidth: 400, mx: "auto" }}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="error"
          size="large"
          startIcon={<HomeIcon />}
          sx={{ borderRadius: "50px", px: 4 }}
        >
          Ana Sayfaya Dön
        </Button>
      </Box>
    </PageContainer>
  );
};

export default NotFound;
