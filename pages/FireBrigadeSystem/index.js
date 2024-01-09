import { Box } from "@mui/material";
import React from "react";
import BasicLayout from "../../containers/Layout/BasicLayout";
import InnerCards from "../../containers/Layout/Inner-Cards/InnerCards";

const Index = () => {
  return (
    <div>
      <Box titleProp={"none"}>
        <InnerCards pageKey={"FireBrigadeSystem"} />
      </Box>
      <div
        style={{
          // backgroundImage: `url(
          //   "https://www.jamesuncle.com/admin/businessimage/Fire%20Brigade%20james%203.jpg"
          // )`,

          // filter: "blur(8px)",
          // // -webkit-filter: "blur(8px)",
          // height: "100%",
          // backgroundPosition: "center",
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",

          backgroundImage: `url(
            "https://www.jamesuncle.com/admin/businessimage/Fire%20Brigade%20james%203.jpg"
          )`,
          // // backgroundImage: `url(
          // //   "https://punemirror-dev.s3.ap-south-1.amazonaws.com/full/cc4349b6baf91888c72d7604daa8aad15df6eb82.jpg")`,
          opacity: "0.1",
          backgroundSize: "cover",
          resizeMode: "cover",
          backgroundRepeat: "repeat",
          // backgroundSize: "300px 100px",
          backgroundBlendMode: "lighten",
          height: "30vh",
          position: "absolute",
          // border: "2px solid black",
          height: "100vh",
          width: "100%",
          // display: "flex",
        }}
      ></div>
      <h1
        style={{
          backgroundColor: "rgb(0,0,0)" /* Fallback color */,
          backgroundColor: "rgba(0,0,0, 0.4)" /* Black w/opacity/see-through */,
          color: "white",
          fontWeight: "bold",
          border: "3px solid #f1f1f1",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "2",
          width: "80%",
          padding: "20px",
          textAlign: "center",
          fontSize: "50px",
        }}
      >
        DashBoard
        {/* &nbsp; &nbsp;
        <img
          style={{ width: "100px", height: "100px" }}
          // src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHsAegMBEQACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAGBwQFAAMIAgH/xABBEAABAwIEAwYDBgQDCAMAAAABAgMEBREABhIhEzFBBxQiUWGBMnGRFSNCgqGxM1JiwSRD8FNykqKywtPxCBc1/8QAGwEAAgMBAQEAAAAAAAAAAAAAAAQDBQYCAQf/xAAzEQABAwIFAQUIAgIDAAAAAAABAAIDBBEFEiExQVETImFxsRQygZGh0eHwQsEjUhUzcv/aAAwDAQACEQMRAD8AeOBC+E2wIXgOtqWUBaSsc0g7j2wIWwYELy4tLaSpaglKRckmwAwIS6zL2tUqE45Ey+wqsy07KW0rSwg+rnX8t/njlz2s3KngppZzaNt0vatmvNdcUrvtZchMnlGp33QA8iv4j9cKPrP9QryDAeZXfL7qicp7TrgdfdlOvD/MXIWVfW+IfapE+MGpOR9SrOnVfMFIWF0mvzm7f5MhzjtH8qr29sdsq3D3glZ8CidrG631R/lntcaK24ubogguKISmcxdUdZ9eqPe4+WHGSsfsqKpopqY98adeE0WHm5DKHmVocbWNSFoUClQ8wRzGJEoveBCzAhZgQswIWYELMCF8O4sNsCFzDXsvy8uZmfi1VT7c155b0WpNOqSZKSb3Cuih1Hn7ErzGRnebsrfDmUk47GUWdwequ4Ocs5wEcNqviQ2BZIlxkuKH5tiffEIrOoTbsAN7sk08lHlSs2ZzkinTKjKqIUCvuUVCWG9IIBKzcXAJHM9cSNmfL7gUEuH01GQah5N9gAvdZy2/lqPFTNl0xD7rmgQI7upxCbE6+m21jYdeeIpaezC4m5TlFigknbCyPK1TVUGH/wDXjWYW1SDOTL4T2pzwAcYtWCQLdUne5xIYWGK4GtksyuqG1/ZyP7uYi3xsp2RMvU6sU6szKjCfmuRVJSy0w8tClWQVEJsQLm454KZjXR3IXmL1M0dTZjiNBsVrzbQKZTKHT6nCZn06RJeLaqdOd1rKfFc8yQRYHnax5Xx7PFGGF1rLzDK6pfUNjc64KrMv5ZnZlE4Q3IzbcVCdfeAdLilX8Nxy2FybHmNsQQQZ25r2VhiWJezyCLKHC2t1sYczr2dLS1G0tQnllLceV99GUu1/ApJ1J2BNtuuGs74xd+o6qn9np6t9qc5XH+J2+BVs52sZpU1papNJQ7b41OOKT/wix/XHPtca7/4SqvbT5obq+dM3SFcR7MEht1xWliLT2Uous7BIHxK388eMqDI6zQu58Ljpoi+aTXgAJ95YNSOXqca5/wDpd3R3m1vjtve21/O218NKlVpgQswIXw4ELn9GcczUvNdTnGfJlFic8y/T3lnhKbSqwShPJBtaxHPrfC7pskmV2ytYcP8AaKTtYj3gTcJqPM5e7TcppJ+9ju7pUPC7FdH/AEqH0I8wcMKr1BSVq1KqOWauaPWhdZuYspIsiUgdR5K8x/7NfUQZe83ZarC8T7a0Up73B6/n1U/LFT+xsyU6oFVmkucJ+3VpfhN/QHSr8uOaV+V9uqlxmAS02Ybt1+HKv+09TEOqKpUWlQI4kaJrk1tH37q9RuL9PW97hXTDNTJlba26psHpu1mz5rZfqqiDmFEbJlVy85CfdXKdUth1JRoRcJIKrm+ygTsMRxzsEWUnVOVWHVD6wysGlwfReaNmV2j0Gs0uOysPz1FTUpuRoUyShKb2Avta9wceQztZHlO66rsNlqKntARbTle6vmM1XLNLpcmPKXPhPalzX1pWFpssfEVarkFPMdMEs7HRW5XNJhs8FYJLdy5541sifIsuCMnuU2nPUx+sy3FrkQKgoth0E6Sggi6vuwBcAj2w1FYMAaVUV5kdUOfICLn6IOzKh1itOQnIDtMajIRop3fC+02og3WjchIINrC2w5C+Fqt50arbAoGHNMdxoqh98oW0yy0uRKeUEMx2xdTivIDC0URkOiuKytjpGZnb8Dr+E1siZGjZXYVmPNDrKqolsrK1qHCgotuE9L25q9h1JtGMDBYLGVNTJUSF7ygbPGfKpmBb8mlTZlMpMZKjGDDqmnHzbZayN7eScQvns8ManoMOvTuqJdBbT96J6UByS9Qqc7Ov3pcZtT1xbxlIv+uGFVKfgQswISE7SoiIXaJPDQsmZGZkqH9W6Cf+UYSrBoCtBgDzmezyKq8v1yflWqmp0scRtdhLhk2TISOo8ljoccU8+Xuu2TWKYZ2t5Yh3uR1/KcUuNQO0vKSSF8WO94mnUizsZ0fsodR1+RxYLLagpI1+BMytOdpeY7AhJUzKAOiU35j18xhCWnIcDGtNRYtG+IsqTqB8x91c5byHmPMI7w2wijwnPEZExJU876hHP3URiVtPfWQ3SUmLCMZKVgaPqjuD2OZeQgfa0moVNw/FxXy2j2Si1vrhhrGt2Cq5KiaX33Er1JyP2YxHTFlMUxl8bFtycUrHsV3x0oVql9j+XH2guiy51PJF0KZkcVB9bKvce+OXMa7cKaOoliN2OIQJmbIuY8vNLXLjN1mmJ3U/Fb8aB5raPvuLjzws+m1uw2KtoMZJGSpbmCH2pXenGGqYhc6ZLUEsMoUVLWeW9+QAHXkBiAQySP76sn11JSQZoba7Af30TmyHkmJk+I7Wa6+y5VlNlT8lZs3GRbdKCeQHU9cWDWhosFlppnzPL3m5KX+eM3v50lBmOVtZeZXdts3SqYofjWOifJPufRaony91u6t8Lwwy2mlHd4HX8Kmhw01Ot0amuJSWZU9pDqTyKAdRH0TiCkF5LlWONvy0waOSF0uBYADFkskvuBCzAhc+57qbVZzzUpcZQXHjIRCbWOSii5Xb8yiPbCNY7Zq0mAQkZ5T5fdU2ElolOy7mCblKpqqNPHEiubzYZVZLqR+JPksefXDlPOR3HKhxXDQ8GePfkdU9YhpGaadTqr3duUxtIiqfa3Qq3MA8jh9ZdR6Zmyn1CpOwmw83Z5bDDzqdKJDiP4iUHzTY7EAkAkXAvgQiDAhIvMdJjwsxVlp+Gt1uO+qU0oR2XdCHBrPiVvfXxDY32thCpJa8WO/iUzDYt148E2smU80zLFOjOBYdDQcdCiCQtfiVy2Auo7DYYeAsLJcm5urkjHq8QtlumZUFVqlaoEeN3suqYlPtDZK07qA6C99yOeBCV+fM4uZxkmHAWU0BhfTYzFg/Er+gHkOvM9LK1E+Tut3V1heGif8Ayye76oeAsLAWGK5awC2y8pmLpk6n1VsKV3CW3IUlPNSEnxD6E4YpXZZLHlVWMRdrS3bxqul4UpibEZlxHEusPIDja0m4Uki4OLNY5bsCECdrOZnaLQ0U+nuaKlUyWWlJO7TdvG57DYepHljl7gxpcVPTQOnlEbeUmEBiDGbbSCltACRYE/tip70riVtc0NHE0ONhst5544TSnZaoRzVmWLR1au5pHeJyk7fdJOyb/wBRsPqcOUkdznKoMbqy1ogbzv5Js5srFXpE2HTaJGiRmHGClh59F0OOcksosQErA8QCrBdtItuQ+swh9mmx/sKVWlSVGO4qy2JCzxZboX8ThT4kSNeyAgXQQE2PICESZWzOFluBU3lrWXCyxKdSEKW4ObLyeSHx5cljxJ52AhL3tOzNDo+aK9DktvqelRGw2WwCkfdkC+/mcKVFO6V7XDhTxShjSDynZG8MRkeSE/thtQIIzRX5dXnpoGXrrDjhbkPtuFBXY2WhCh8KU38bnS+hN1kWELZ2WPIk0x6TFajtR1tsBSIqNLXGCLLKR08PD98CEB9qGXUZdzI3UoaNFOqyjrSPhak89vLWN/mDhWqjzNzDcK5warMUvZOOjvVDHcHSh2eh1ZbQpLTjN1KKyrZNk9OR5c8LsZniNtxsrWqqGwVjGuNmuGtzp024tb6qN3cRYyxFQrW7qIZWjSltQ2It5dT7jncYkli90u+PqlaSr0mDANxlHGuny5PxTF7DcxOI42W5pKRpMiAF9E38aAfIGyh6E4bY4OFlSVUJjcDawOoTfvjtLLnnOVVVXc6VSYSSzEcMKOOmlB8Z91X/AEwjVv1DVpcCpxldMfIf2qiOiVx3HeHDW2QQkPBZKQixJ2SR1F9+R9MeMyBgH76pPE5ZH1Ba7Ybff4ryw28yVsyOGVJ5cMKsL323Av8AQeXTEU4F7hW+ESySQlr/AOJt++SK8vNSKb2X5gzBEecYlzZzTTbzR0qS0l5DdgfW6/rh5gyRadFnp3iorTm2LrfC9kxcmymM25JaYq2mYsAxpaXdypaTzPqRpVf1vjuN2ZoKXqYTDM6M8FC1aiqomZIsF+ekzXxeBKWsa3k7IKXL7IfCfAh+24Ok747uoQCdQqnM2ZaatTMbLVPShtCODKVJSQh5Iv8AdlN7qUlW/E1AhQ2Jubry1DYzbcqzo8KlqW5yco9fgh1+rVCS3NVPSxUH5TIb4ridC02RpBvvc2+vnhR0wkc1x0srB2CujYezcD5i31TJm5wczLFYpeWG5QU8jRIWfunEqtu0k76bAgrcFwkEadSlAYsgQRcLPSRvjcWPFiEV5by2xRKcWUqSqS42EOvNp0gACyUIG+lCbmw+ZJJJJ9XCsKNS4dFpkenU1lLMWOjShA/cnqTzJ64EKi7TqR9s5IqjCU3eZaMhi3MLb8Qt87Ee+BegkG4SRpzqH6XMd4IXqipeCrAlsA77X3uVjbzA8sJU4sXsWjxOTO2CoH124Oq8nwMNoUhaQHFIRxEEGxsu45bEi/pbmeePZRlgsPqo6H/JiJc5wJtfTa9rfS5XgTXaTNh1mNfjU94PAD8SOS0+6b4gpn5X26qxxin7WmLuW6/ddLRJDcuKzJjqCmXm0uNqHVJFwfpizWOXLkB11ynpdduXHniXjfSRqcOo39LnFfILz2K1NM90eF5mb6+u/wAFeQFtttIRHkF0aHFuAkHhuaVXFx6JQbHff1xy8W3FtlSOkMpzONyoNRW59tFCUuBKW0klVtJSUgi3rqvzx4Q3swebqzwp0onIb7ttenCO0Nob/wDj3DCPxFhR+ZlpJ/U4sJPcPkqak1qI/wD0PVCmXa5UqHXGhTJC2hKIQ8kMl5LlgbeAblQ6Eb+2EoHvDSG6+CvsZgjNnnQ6aqbneTMqkiHOqSlKeF4+1NdjhSCCoAqUbbEXHXc49e+VzbvbayQw0MFQGA3Drgj4IapqQIjagoq1gKF/5en6WwvKe+QtLRNtC13X04+llsYIfj+K5BKhcehIx47uOXURE0Wvj6qbl3MEvL8hFRjyUsBxsMylqZ4l032OnzCv0JwxE9zHFrVT4hTCenZOfeGh8ePVF0btEky9hmcMjqtUFCEj8ygQPc49dUTj+IVOaOwzG9lLazDUJR+6zq6u/INJif8AjOInVs4/hb5rwU8f+yIsmz5smbVaXUZb01ox232nHtOoBWtCk+EAW8II26nDdLOZWku3CgmjDDpskrlQceFEQpsOamnE6Sq1rBRB9baQbdeWOGm1QVcztz4Sx3Q/2QvcdpTdP4q2nUKU626ri/iUvUkqGw5XA68xiSYXicLbJeiIbWxvzAl24HFwdF6dSlbS0q+FSSD74rWmxBWskaHsLTyCiSgZzmRaDTY6EuaWorSBY9AgDFyvnipKxAVSsy1ulup2amLW2CObTh1p/Q2whVNIcHLVYHKHwGI8ehWQZMdlhTS1pbAW8ACNIGppKR6c0kY4DHZbnw9VX4i+M1BDONPotct9L01KkBeksNALt4SQnxC/K4P+jjyRpDQU7g0rcz2eR+SKIUxLnYQ9ER4nIVQRHUknr3pCwPooYsCQ6O/gqSNhjq2s6OHqhvL1SZp2aKRNqCODHjygp1wqB0pKVJufQFQJ9MKUwaHbq8xd0j4LFlrHrdbc4V+rVqtPGbMU22xKWERFuWaYSLpSdP4lEG+o877G1sdzSG5a4aJfD6ZgYyaMjNc3udtLbfvmqNAgMtIaemNrCUhI4jwtYDyvbC5MhNw2ytGspI2BskgNrDUi3y2XtIpoQS2qOgAfE0sI/UYP83N17egHuuaPIgei30iXBgVGE/Md71T47yXVtNuIDirG6RckAjUPS9jviaIWdmc0hIVjs0HZQStI6Ei/z/Si/PWZcqV+lBVPp6kz0uIUJS2EtBtvV4wpV/ECm4tvuR5XxNJIwtIG6rqSjqY5WvcLN5Nxa3PmmRkinMycl0cVaCy68YiNQkMhSrW8Oq452ticXtqqx+XMcuylyYNGypSKrUadT4kEJjKdd4DQQFaEqI2A9T9cerlc/wCXmUNxqf3hoLQFMgtqVoCtShcE9NtX0wiyxlLz5LR1AcKBkDdy0uPkNfVbAkticQnx6Fk+NNlEOJVfSN+QJ1bja3XdgtHeHVVzZiRC4n3SNhb5nrotM57u8N50bkJOn1PID64rYm5ngLWVcoige/oE7Mv5GiR6DTWZgIktxGkOgAfGEAH9cXCwN0M9tlFMd2FmhhHgbAiTvRCj4F+yjb8wxDPHnZYJ/Dan2ecE7HQoCaeeZBDMh9sE3sh1QH0viszHlax9FTyOzFup815WpbitTrjjiuhccKrfK52x4XE6KSKmhhN2N1V/2dvwVV+Tl6tMpfplaCVoQsnSJDe4G3K4H1SMWFK8OZlPCzWNU5in7UbO9QmiezrKKk2+xmrejrg/7sMZG9FVGeU6Zz8yqPNL1IpqWqJRKcwua2lEcOhhLzkcEXQ0jVfU6RuATZKfEqyQArpRWVvljK0bLtOcly22e9hk7J8SI6B4tCSee9ypZ3UdzYWAEJNwKxmqJTo8ZrL61Npas2QjUCnhgI5f1bn02xWvjp3PLi9ONfKBYNRXQYE4ZSg1N5S46G3JAS+22FO0hfEWkp028bFuY5ovcbfDYNILRbVKHfVWdQXAUzBhw6U1BqMMoW0pCEvuurIOhLBP8ZK9ypxVgEklVlX09LxWNFrL+W58elTGQw286lr7NSsrVHUrkuOf8xg73TzbsfwiwELV22VkM0SPQWV/4iqOWct+BhBBWfc2HuccSPyNJTNJAZ5mx/tuUp7PKafbXpSi54WnnYpAufXYYrC8WaB+lbBlMS+Rz+dB5W/tTpmlmrSXHW2wlZWsBnVZKXGzpCRe1vEBuOXlh5z2sl15G6zcNNLUURDSTlOjfE8/VT8h0Q5jzZDjrSVQ6dply/IqH8NHud/kDiOmj1L/AJJvGaslrYBvufsugvr+uHFn1HqcGNU4EiDNaDsaQ2ptxB6pIscCFzlOpb9ArE6hyVqcXCWA26RbiNKF0K+dtj8sVtVGGuuOVrsGqjNFkdu304WvCyuFGmhxZYaipeXOW6nuiWP4hdBukp+RwxTB2e7VWYs+EU5bJzt5rpKkpqTlCjoq7iGqmpgB9ce1kuW3Kbi39vbFmsYqjKWUU0VSpU59Myf4koeCCAhJPiIBJOtZGpaiSSduQAAhQO0GsGXCl5cpiiqU+3w5jiRtHaULkX5a1J2A6BWo9LwzTthFypI4zIbBKSPlGtRnqXGFXqCWXW198WzIUEsqAukDf1A9jhM1Ubg45RptpumOxeCBdHXZhNk5Wjij5heUpqa+pTMpaipKXiq2hR6BYCVAnqVA72uzDURyEtaoZIns1KvMw5eepRTMozUhUZlZcaaiJCn4Lh5qZB+JtXJbR2sbi1rYZUKLaY2/IgwpNYiR26klq6w34w0ojxBKjv8A664EJB5vXVFZ2qKswtcKcs6YwHwd2Hw8M9RzJ9cJVYdp0WiwJ0ILh/M+ngoGEVpFplOGNHW42grc2CUjmpRslI/YYkYDK8AlKVD2UkDntFrepT7yBldvK1Abik8SY8eNMePNbpG/sOQHp64tgABYLDPe57i525RNj1crMCEi+1ZSFdoj3D5ppzIct/NqWR+lsJ1nuhX+AX7R/khVxag40yw0t+S8oIZYbF1OK8hhSOIyGwV5WVjKWPM7fgJx9nWQ0Zda+1KrofrbyfGsbpjp/wBmj+56/LFoxgYLBYqoqJKiQvehntA7RZM2Yuj5SlFlplX+KqTe91D8DfnvzPt8+JZhGPFM0NBJVu00aOVOyv2sMttoiZvaMZ4bCeygqZc/3gN0H2tz3GPY5myDRc1VBNTHvDTqiOpUClZpvVKNVUNvOpCVvxlJdaeAFhrT1t5gg9L4JIWSe8lWSOZsqY9n9cSSG64zY+aXv7rP74gNE0n8BS+0FWdIyImO81JrdSXN4Kw6lhKShnWncKVdSlKsRcAm3LbEsdOyM3G6jfK52i95k7Ssu0LWwiSajOGwiwfvFX/qUPCn3N/TExIAuV5HG+R2VguUvEdpOaE1xFXfS0YQGhVJaNxwzzIX1c9eXTrhcVTC63CtXYLO2HOfe6fvKY1Sp9B7TMsNPMvBST4o0lAs7Gc6jzBHVJ5/Q4YIB0VQC5jrjQhJeoQZ9Dqa6TW2uHMRuhwfBIR0Wg/uOmK6eDIbjZa/DcSFSMj/AH/X8rWhSET6a47bhInx1OX/AJeIm+PKX/sXuMg+yHzC6cGLNY5ZgQswIXMlXqblVzDVJ6ULflT5y2ozDYupaUnQhIHyH64Sna6WQNHC0OHzRUdIZnbuPom/2cZFTl1r7Vq+h+tvIspQ3TGQf8tH9z1/dpjGsFgqWoqJKiQveUK9oufl1lx+g5afKYIuibUGz/E822z5eavp6xzTCMeKaoMPfVuvs0blDWUqI3Vq7ApLbdo1+K+Em1mUWJ39SUp/NhWnaZJMzleYnK2kpRFFpfQeXP74q9rGWKPIh1idlWc+v7KUsS4L4KhZN9XDWd/wqtcqBtbbDL6djttCqinxWohIEveaevTz+6GKRlypTuNOoFPmfdOcNb8F8Mq1aQrlqBOyh064hiE5bmB+adrHYa2YxyMIPUfv9KU7KzdCkNwHavmRmQ7/AA47iiVr5/DsSeRx2Xzg2yhQNpcNc0vEjrD96LVU6NmF6M5IrjWYZEVI1LVLW4UJHmU9B7YHe02XUTMJDgC4nzv9grfKWQJlYgx5UeRBgQnwVNkAuOKANj4BYDfzJ+WPBTF2sjkSYs2C8dNGBb94+6pau1T4VSfZp056XCaAvIkN8M69wtPIbAgb262ubYgnjY1wDFZ4ZUzSxOfPtwfBbMvV6oZVqP2lSfvmXSO9wyfDIT5p8ljocSQT5e65LYlhomHbQ7+viPFN6fDoPadlZt5h06TdTEhIs7FdHQjoR1HUexw8QCFmWuLXXGhCSddpc6lypNDraOHLCSWnU/A+notJ+dtumEXxGF4e3ZaanrW11O6CXR1vn4roDItVcrWUKRUXt3n4yS4bWusbKP1Bw+sur3AhZgQqKBlDL9Orb1Zh0thqoP31vJvzPMgXsknqQBfAhLTtKztJq02ZlyjOLjwY7hZnSkmynlD4mkeQHInry5c4JphGPFWWHYe6qdmOjRugDvtPhpDPHZbCBYIB5YR7OV5zELTCqo6cdmHAWV/kjOEWg1OQ+0y1OTJbS2oIe0OtpBJOm+xvcX5fCN8MQuMIs9vxVTiETa6QOhkBsNr2+StpuYKJDy3Mo+VYM5lVRJ70/LVcoSRZQBKiSbbDoLk8+cjqmNre7ulYMKqpZAJhZo9BwER5KjuJ7OFKbgz5RlS3VluC/wAB6wd0hSV6k2+AHnvyxLELRhJ18meqkPj6aIRVKfaz/BclpqbQYmRmmWqm7xHkNqIG5ub3UpW9ziNxPbtHCZgjZ/x0rxvcfQ/lHGYMx07Lddqanp1VmzH46NFMIvGbBTYEEiyb2N9+p2xK+RrB3ikqekmqD/jbdLXJstvLdbpc1ZAbaKWJLgHNpXhUT6AkL9r4ThmJl1OhWgr8Pa2kBYO821yNzwfupU+sU2mZ0lVmnNRZ0BL63W0ykltsqWm6ikqGxDm4UByJA54lLw2W7db9Ek2mfLQhshy5Tpm0BBQ6atAU44e8x0a3FL0NkhCLknSL9BewwtJHI9xcG2VtS1VNBEIjKDZWuXK/NyzUTVaKoSGXbCXESvwSEjqLcljocSQTFhyPSuIYcyob29PqfDn8+qdS4WWu0XLsKZKhpmQ3RxGtZKFtnkoXSQQbgggGxt1w+sxsiKFEjwYjMSGyhmOygIbbQLBKRyAwIW7AhZgQswIQdU+zPK1Uqz9SmQHFPPr1vITIWlC1eZSDbHlgug5wFgdEQ0yh0qlMJZptOixm0iwDTQH69cerlRMwZToeYY6mapTY7pI2dCAlxHqlQ3GBF0n8ydn+YMtlTsNDlZpg3C2x/iWh/Un8fzH0GFZaYO1boVd0eMviAZL3h9UMwJjepRp8p1hy5K0sOqaUD1uAQb4WcZo9CreOPD6u7mgEn4FSHnXn3zIfkvuyCpKuM46pSwU20+I77WFsRmZxcHE6hMNoYGROiA7rt/26+TJa3HFyqhMW44oAKekulRIHIXJ9cDnPlOuqIoaejYcvdHiVJodFrmZVJFBpy1snnNk3bYT635q/KDieOkcfeVdU43G3SEXPXhNXK3ZhSKSRKq4TV6jz4slALbfohHIfM3OHmsawWas5PUSzvzyG5RkqnQVtcJUOOW/5C0m30tjpQoSqnZXlOoSC+iC5BdV8RguloK/KNvoMeEA7rpr3M902RVR6ZEo1Nj06ntcKLHRobRe9h6nqcerlTcCFmBCzAhZgQswIWYELMCF8tfAhDeZ8nZdrjDr9TpMd19KSQ8kFDm3LxJIP64EXI2XOeZ46KfmREGGt9uMVWLYfWdvmTfHORvRTiqnAsHn5lO3ImRss9yaqLtJZfl7feSFKdt8gskD6Y9AA2UTnucbuN0wkJCUgJAAHIDpj1cr7gQvuBCzAhZgQswIWYEL/2Q=='
          // src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBF8OcXv4WseP5Ch2H4t4_UQCQn_B5-4tvuQ&usqp=CAU'
          alt='img'
        /> */}
      </h1>
    </div>
  );
};

export default Index;
